import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, {useState, useRef, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Icon } from "react-native-elements";
import { SIZES, COLORS, FONTS, icons, images } from '../constants'
import { PickUpModal, RequestRideModal, OrderFoodModal } from '../components';

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
  
  const [origin, setOrigin] = useState({})
  const [destination, setDestination] = useState({})

  const [pickUpModal, setPickUpModal] = useState(false)
  const [orderFoodModal, setOrderFoodModal] = useState(false)
  const [requestRideModal, setRequestRideModal] = useState(false)

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

  const handlePickUp = () => {
    setPickUpModal(!pickUpModal)
    console.warn("origin: ", origin)
    console.warn("destination: ", destination)
    setRequestRideModal(!requestRideModal)
  };

  const handleRideBooking = async () => {

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

    } catch (error) {
      console.error(error)
      setModalVisible(!modalVisible)
      setAlert({
        title: "Error",
        message: error.message
      })
    }
  }

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
        modalVisible={pickUpModal}
        setModalVisible={setPickUpModal}
        handlePickUp={handlePickUp}
        setOrigin={setOrigin}
        setDestination={setDestination}
      />

      <RequestRideModal
        modalVisible={requestRideModal}
        setModalVisible={setRequestRideModal}
        handleRideBooking={handleRideBooking}
      />

      <OrderFoodModal 
        modalVisible={orderFoodModal}
        setModalVisible={setOrderFoodModal}
      />
    </View>
  )
}




export default Services