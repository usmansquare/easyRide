import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { GOOGLE_MAPS_API_KEY } from '@env'
import Animated, {
  interpolate, Extrapolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withDelay, withTiming, runOnJS
} from 'react-native-reanimated'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { presentPaymentSheet, initPaymentSheet } from "@stripe/stripe-react-native";
import * as Location from 'expo-location'
import { toggleTheme } from '../actions'
import { useSelector, useDispatch } from 'react-redux'
import { COLORS, FONTS, SIZES, icons, images } from '../constants'
import { LineDivider, CustomAlert, FavouritePlaces, PickUpModal, RequestRideModal, RideModal, PaymentMode } from '../components';
import { ridersAround } from '../utils';
import { MapStyle } from '../styles'
import { auth, db } from '../firebase'

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)
const HEADER_HEIGHT = 280

//ADD localhost address of your server
const API_URL = "http://192.168.10.9:3000";


const Home = ({ navigation }) => {

  const scrollY = useSharedValue(0)
  const scrollViewRef = useRef()
  const _map = useRef(1)

  const { appTheme } = useSelector((state) => state.themeReducer)
  const dispatch = useDispatch()

  const [pickUpModal, setPickUpModal] = useState(false)
  const [rideModal, setRideModal] = useState(false)
  const [requestRideModal, setRequestRideModal] = useState(false)
  const [paymentModeModal, setPaymentModeModal] = useState(false)

  const [origin, setOrigin] = useState(null)
  const [destination, setDestination] = useState(null)
  const [travelInfo, setTravelInfo] = useState(null)
  const [favouritePlaces, setFavouritePlaces] = useState(null);
  const [paymentMode, setPaymentMode] = useState({})
  const [rideDetails, setRideDetails] = useState({})

  const [alertModal, setAlertModal] = useState(false)
  const [alert, setAlert] = useState({
    title: '',
    message: ''
  });

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  });

  const checkPermission = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status === 'granted') {
      const permission = await askPermission();
      return permission
    }
    return true
  };

  const askPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync()
    return permission.status === 'granted';
  };

  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return;
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      setLatLng({ latitude: latitude, longitude: longitude })
    } catch (err) { }
  }

  useEffect(() => {
    checkPermission();
    getLocation()
  }, [])

  useEffect(() => {
    if (!origin || !destination) return;

    const getTravelTime = async () => {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      setTravelInfo(data.rows[0].elements[0]);
    };

    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_API_KEY]);


  useEffect(() => {
    setFavouritePlaces([])
    db.collection("passengers").doc(auth.currentUser.uid).collection("places")
      .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setFavouritePlaces((previous) => {
            return [
              ...previous,
              doc.data()
            ]
          });
        });
      });
  }, [])

  const handlePickUp = () => {
    setPickUpModal(!pickUpModal)
    setRequestRideModal(!requestRideModal)
    setFavouritePlaces((previous) => {
      return previous.map((p, i) => {
        return { ...p, selected: false }
      })
    })
  };

  const handleRideBooking = async () => {

    if (paymentMode?.text == "By Cash") {
      setAlertModal(!alertModal)
      setAlert({
        title: "Alert",
        message: "Ride Booked Successfully, Have a nice journey!"
      })
      saveToDB()
    }
    else if (paymentMode?.text == "By Wallet") {

      db.collection("passengers").doc(auth.currentUser.uid).get()
        .then((doc) => {
          if ((doc.data().wallet - rideDetails?.price) > 0) {
            db.collection("passengers").doc(auth.currentUser.uid).update({
              wallet: doc.data().wallet - rideDetails?.price
            })
              .then(() => {
                console.log("Document successfully updated!");
                saveToDB()
                setAlertModal(!alertModal)
                setAlert({
                  title: "Alert",
                  message: "Payment Transaction Successfull, Thank You!"
                })
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          } else {
            setAlertModal(!alertModal)
            setAlert({
              title: "Error",
              message: "Payment Transaction Failed, Not Enough Amount!"
            })
          }
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
    else if (paymentMode?.text == "By Card") {
      try {
        const response = await fetch(`${API_URL}/create-payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) {
          setModalVisible(!modalVisible)
          setAlert({
            title: "Alert",
            message: data.message
          })
          return
        }

        const clientSecret = data.clientSecret;
        const initSheet = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'Usman Aslam',
        });

        if (initSheet.error) {
          setModalVisible(!modalVisible)
          setAlert({
            title: "Error",
            message: initSheet.error.message
          })
          return
        }

        const presentSheet = await presentPaymentSheet({
          clientSecret,
        });

        if (presentSheet.error) {
          setModalVisible(!modalVisible)
          setAlert({
            title: "Error",
            message: presentSheet.error.message
          })
          return
        }
        setModalVisible(!modalVisible)
        setAlert({
          title: "Alert",
          message: "Payment Transaction Successfull, Thank You!"
        })
        saveToDB()

      } catch (error) {
        console.error(error)
        setModalVisible(!modalVisible)
        setAlert({
          title: "Error",
          message: error.message
        })
      }
    }

    setFavouritePlaces((previous) => {
      return previous.map((p, i) => {
        return { ...p, selected: false }
      })
    })

  }

  const saveToDB = () => {

    db.collection("rides").add({
      paymentMode: paymentMode?.text,
      ...rideDetails
    })
      .then((docRef) => {

        db.collection("rides").doc(docRef.id).update({
          id: docRef.id
        })
          .then(() => {
            setRequestRideModal(!requestRideModal)
            console.log("Document successfully updated!");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      })
  }

  const toggleThemeHandler = () => {
    if (appTheme?.name == "light") {
      dispatch(toggleTheme("dark"))
      console.warn(appTheme?.name)
    } else {
      dispatch(toggleTheme("light"))
      console.warn(appTheme?.name)
    }
  };

  const renderHeader = () => {
    const inputRange = [0, HEADER_HEIGHT - 100]

    const headerHeightAnimatedStyle = useAnimatedStyle(() => {
      return {
        height: interpolate(scrollY.value, inputRange, [HEADER_HEIGHT, 100], Extrapolate.CLAMP)
      }
    });
    const iconFadeAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollY.value, inputRange, [1, 0])
      }
    });

    return (
      <Animated.View
        style={[{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          zIndex: 1
        }, headerHeightAnimatedStyle]}>
        {/* Place Image */}
        <Image
          source={images.banner}
          resizeMode='cover'
          style={{
            width: '100%',
            height: '95%'
          }}
        />
        {/* Search Bar */}
        <TouchableOpacity
          style={[{
            position: 'absolute',
            left: 10, right: 10,
            bottom: 0,
            flexDirection: 'row',
            borderRadius: SIZES.base,
            alignItems: 'center',
            padding: SIZES.radius,
            backgroundColor: appTheme?.searchBarBackground,
          }, { ...styles.shadow, shadowColor: appTheme?.shadowColor }]}
          onPress={() => setPickUpModal(!pickUpModal)}
        >
          <Image
            source={icons.search}
            resizeMode='contain'
            style={{
              width: 22,
              height: 22,
              tintColor: COLORS.gray40
            }}
          />
          <Text style={{ flex: 1, marginLeft: SIZES.base, color: COLORS.gray40, ...FONTS.body3 }}>
            Choose Pick-Up Point
          </Text>
        </TouchableOpacity>

        {/* Header Bar */}
        <Animated.View
          style={[{
            position: 'absolute',
            top: 0, left: 0,
            right: 0,
            paddingTop: 30,
            paddingHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }, iconFadeAnimatedStyle]}
        >
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => toggleThemeHandler()}
          >
            <Image
              source={icons.sun}
              resizeMode='contain'
              style={{
                width: 25,
                height: 25,
                tintColor: COLORS.white
              }}
            />
          </TouchableOpacity>
        </Animated.View>

      </Animated.View>
    );
  };

  const renderAroundYou = () => {
    return (
      <View style={{ marginTop: SIZES.padding * 1.5 }}>
        <View
          style={{
            padding: SIZES.radius
          }}
        >
          <Text style={{
            ...FONTS.h3,
            fontSize: 20,
            color: appTheme?.textColor
          }}>Around You</Text>
          <LineDivider
            lineStyle={{
              width: 60,
              height: 2,
              marginVertical: SIZES.base,
              backgroundColor: COLORS.primary
            }}
          />
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center"
          }}>
          <MapView
            ref={_map}
            provider={PROVIDER_GOOGLE}
            style={{
              height: 220,
              marginTop: SIZES.base,
              width: SIZES.width * 0.92
            }}
            customMapStyle={appTheme?.name == "dark" ? MapStyle : null}
            showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={{ ...ridersAround[0], latitudeDelta: 0.008, longitudeDelta: 0.008 }}
          >
            {
              ridersAround.map((item, index) =>
                <Marker
                  key={`rider-${index}`}
                  coordinate={item}
                >
                  <Image
                    source={icons.taxi_icon}
                    resizeMode="cover"
                    style={{
                      width: 25,
                      height: 25
                    }}
                  />
                </Marker>
              )
            }

          </MapView>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: appTheme?.backgroundColor }}
    >
      <StatusBar backgroundColor='transparent' style='light' />

      {renderHeader()}
      <AnimatedScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
          paddingBottom: 110
        }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode={"on-drag"}
        onScroll={onScroll}
      >
        {/* Render Saved & Favourite Places */}
        {
          favouritePlaces &&
          <FavouritePlaces
            favouritePlaces={favouritePlaces}
            setFavouritePlaces={setFavouritePlaces}
            setModalVisible={setPickUpModal}
            setDestination={setDestination}
          />
        }


        {/* Render Around You */}
        {renderAroundYou()}
      </AnimatedScrollView>

      <PickUpModal
        origin={origin}
        destination={destination}
        modalVisible={pickUpModal}
        setModalVisible={setPickUpModal}
        handlePickUp={handlePickUp}
        setOrigin={setOrigin}
        setDestination={setDestination}
        favouritePlaces={favouritePlaces}
        setFavouritePlaces={setFavouritePlaces}
      />

      <RequestRideModal
        origin={origin}
        destination={destination}
        modalVisible={requestRideModal}
        setModalVisible={setRequestRideModal}
        travelInfo={travelInfo}
        setRideDetails={setRideDetails}
        handleRideBooking={handleRideBooking}
        setPaymentModeModal={setPaymentModeModal}
      />

      <RideModal
        origin={origin}
        destination={destination}
        modalVisible={rideModal}
        setModalVisible={setRideModal}
        travelInfo={travelInfo}
      />

      <PaymentMode
        selectedMode={paymentMode}
        setSelectedMode={setPaymentMode}
        modalVisible={paymentModeModal}
        setModalVisible={setPaymentModeModal}
        handleRideBooking={handleRideBooking}
      />

      <CustomAlert
        title={alert.title}
        message={alert.message}
        modalVisible={alertModal}
        setModalVisible={() => setAlertModal(!alertModal)}
      />

    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
})

// ----- Code to set Favourite Places -----
// db.collection("passengers").doc(auth.currentUser.uid).collection("places").add(doc.data())
// .then((docRef) => {
//     console.log("Document written with ID: ", docRef.id);
//     db.collection("passengers").doc(auth.currentUser.uid).collection("places").doc(docRef.id)
//     .update({
//       id: docRef.id
//     })

// })