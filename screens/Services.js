import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { GOOGLE_MAPS_API_KEY } from '@env'
import { Icon } from "react-native-elements"
import { presentPaymentSheet, initPaymentSheet } from "@stripe/stripe-react-native";
import { SIZES, COLORS, FONTS, icons, images } from '../constants'
import { PickUpModal, RequestRideModal, OrderFoodModal, RideModal, PaymentMode, CustomAlert } from '../components';
import { auth, db } from '../firebase'


//ADD localhost address of your server
const API_URL = "http://192.168.10.9:3000";

const Services = ({ navigation }) => {

  const navData = [
    {
      id: "123",
      title: "Get a ride",
      image: "https://links.papareact.com/3pn",
      modal: () => setPickUpModal(!pickUpModal)
    },
    {
      id: "456",
      title: "Order Food",
      image: "https://links.papareact.com/28w",
      modal: () => setOrderFoodModal(!orderFoodModal)
    },
  ];

  const [pickUpModal, setPickUpModal] = useState(false)
  const [rideModal, setRideModal] = useState(false)
  const [orderFoodModal, setOrderFoodModal] = useState(false)
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

  const renderHeader = () => {
    return (
      <View
        style={{
          marginTop: 30,
          height: 58,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: SIZES.radius,
          backgroundColor: COLORS.primary
        }}
      >
        {/* Label / Title */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ ...FONTS.h1, color: COLORS.white, fontSize: 26 }}>Services</Text>
        </View>
      </View>
    );
  };


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white
      }}
    >
      <StatusBar backgroundColor='#009387' style='light' />

      {/* Header */}
      {renderHeader()}

      <FlatList
        data={navData}
        horizontal
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: SIZES.radius,
          paddingBottom: 150,
          paddingHorizontal: SIZES.radius
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              paddingHorizontal: SIZES.base,
              paddingVertical: SIZES.radius,
              backgroundColor: COLORS.gray20,
              width: SIZES.width * .45, height: 220,
              borderRadius: SIZES.radius,
              marginLeft: index != 0 ? SIZES.radius : 0
            }}
            onPress={item.modal}
          >
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Image
                source={{ uri: item.image }}
                style={{ width: 120, height: 120, resizeMode: "contain", marginTop: SIZES.base }}
              />
              <Text style={{ ...FONTS.h3 }}>{item.title}</Text>
              <Icon
                style={{
                  width: 35,
                  height: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: SIZES.base,
                  borderRadius: SIZES.padding,
                  backgroundColor: COLORS.transparentBlack8
                }}
                type="antdesign"
                color="white"
                name="arrowright"
              />
            </View>
          </TouchableOpacity>
        )}
      />

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
        modalVisible={rideModal}
        setModalVisible={setRideModal}
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

      <OrderFoodModal
        modalVisible={orderFoodModal}
        setModalVisible={setOrderFoodModal}
      />
    </View>
  )
}

export default Services