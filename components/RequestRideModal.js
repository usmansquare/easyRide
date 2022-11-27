import { StyleSheet, Text, View, Modal, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { FONTS, SIZES, COLORS, icons } from '../constants'
import LineDivider from './LineDivider';

const SURGE_CHARGE_RATE = 1.5;
const GOOGLE_MAPS_API_KEY = "AIzaSyBvYHDUXXUAJdn7gDxJgT1mdmqJt22hQFA";

const RequestRideModal = ({
  modalVisible, setModalVisible, origin, destination, handleRideBooking, travelInfo
}) => {

  const ridesData = [
    {
      id: "Uber-X-123",
      title: "UberX",
      multiplier: 1,
      image: "https://links.papareact.com/3pn",
    },
    {
      id: "Uber-XL-456",
      title: "Uber XL",
      multiplier: 1.2,
      image: "https://links.papareact.com/5w8",
    },
    {
      id: "Uber-LUX-789",
      title: "Uber LUX",
      multiplier: 1.75,
      image: "https://links.papareact.com/7pf",
    },
  ];

  const _map = useRef();
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [selected, setSelected] = useState(ridesData[0])


  useEffect(() => {

    let fromLoc = {
      latitude: origin?.location?.lat || 33.6844,
      longitude: origin?.location?.lng || 73.0479,
    }
    let toLoc = {
      latitude: destination?.location?.lat || 33.7715,
      longitude: destination?.location?.lng || 72.7511,
    }

    let mapRegion = {
      latitude: (fromLoc?.latitude + toLoc?.latitude) / 2,
      longitude: (fromLoc?.longitude + toLoc?.longitude) / 2,
      latitudeDelta: Math.abs(fromLoc?.latitude - toLoc?.latitude) * 2,
      longitudeDelta: Math.abs(fromLoc?.longitude - toLoc?.longitude) * 2,
    }

    setToLocation(toLoc);
    setFromLocation(fromLoc);
    setRegion(mapRegion);

  }, [origin, destination]);

  useEffect(() => {
    if (!origin || !destination) return;

    mapRef.current?.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [origin, destination]);

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{
              width: 40, height: 40,
              borderRadius: SIZES.padding,
              backgroundColor: COLORS.gray10,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: -(SIZES.padding * 2),
              marginLeft: SIZES.base,
              zIndex: 1
            }}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Image
              source={icons.leftArrow}
              resizeMode='contain'
              style={{
                width: 20,
                height: 20,
                tintColor: COLORS.black
              }}
            />
          </TouchableOpacity>
          <MapView
            ref={_map}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            mapType="mutedStandard"
            showsCompass={true}
            showsMyLocationButton={true}
            showsScale={true}
          >
            {fromLocation && toLocation && (
              <MapViewDirections
                origin={fromLocation}
                destination={toLocation}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={3}
                strokeColor="blue"
                lineDashPattern={[0]}
              />
            )}

            {fromLocation && (
              <Marker
                coordinate={fromLocation}
                title="Origin"
                // description={origin.description}
                identifier="origin"
              />
            )}

            {toLocation && (
              <Marker
                coordinate={toLocation}
                title="Destination"
                // description={destination.description}
                identifier="destination"
              />
            )}

          </MapView>
        </View>
        <View style={styles.footer}>
          <View
            style={{
              flex: .2,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: SIZES.radius,
              borderBottomColor: COLORS.transparentBlack4,
              borderBottomWidth: 1
            }}
          >
            <Text style={{ ...FONTS.h3, textAlign: 'center', flex: 1 }}>Select a Ride - {travelInfo?.distance?.text}</Text>
          </View>
          <View
            style={{ flex: .9 }}
          >
            <FlatList
              data={ridesData}
              keyExtractor={(item) => `ride-${item.id}`}
              ItemSeparatorComponent={() => <LineDivider />}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: SIZES.base,
                      backgroundColor: item.id == selected?.id ? COLORS.gray20 : COLORS.white
                    }}
                    onPress={() => setSelected(item)}
                  >
                    <Image
                      style={{
                        width: 85,
                        height: 85,
                        resizeMode: "contain",
                      }}
                      source={{ uri: item.image }}
                    />
                    <View style={{ marginLeft: SIZES.base }}>
                      <Text style={{ ...FONTS.h3 }}>{item.title}</Text>
                      <Text>{travelInfo?.duration.text}</Text>
                    </View>
                    <Text style={{ ...FONTS.body3, flex: 1, textAlign: 'right' }}>
                      {(travelInfo?.duration.value || 0 * SURGE_CHARGE_RATE * item.multiplier) / 100}
                    </Text>
                  </TouchableOpacity>
                )
              }}
            />
          </View>
          <View style={{ flex: .25, paddingHorizontal: SIZES.base, marginTop: SIZES.base }}>
            <LinearGradient
              style={{ width: '100%', height: '80%', borderRadius: 15, marginTop: SIZES.base }}
              colors={[COLORS.sceondary, COLORS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, marginHorizontal: SIZES.padding, justifyContent: 'center' }}>
                  <Text style={{ ...FONTS.h3 }}>{selected?.title}</Text>
                </View>
                <TouchableOpacity
                  style={{ width: 130, height: '80%', marginHorizontal: SIZES.radius }}
                  onPress={() => handleRideBooking()}
                >
                  <LinearGradient
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
                    colors={[COLORS.white, COLORS.transparentWhite4]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={{ ...FONTS.h3 }}>BOOK</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal >
  )
}

export default RequestRideModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387'
  },
  header: {
    flex: 5,
    marginBottom: -SIZES.base
  },
  footer: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
  }
})