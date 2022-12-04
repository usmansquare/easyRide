import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { GOOGLE_MAPS_API_KEY } from '@env'
import * as Animatable from 'react-native-animatable'
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { COLORS, FONTS, icons, SIZES } from '../constants'
import { LineDivider, FavouritePlaces } from '../components'

const PickUpModal = ({
    modalVisible, setModalVisible, setOrigin, setDestination, handlePickUp,
    origin, destination, favouritePlaces, setFavouritePlaces
}) => {

    const destinationRef = useRef(null);
    const originRef = useRef(null);

    useEffect(() => {
        if (origin) {
            originRef.current?.setAddressText(origin.description);
        } else if (destination) {
            destinationRef.current?.setAddressText(destination.description);
        }
    }, [origin, destination]);

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={{
                    flex: 1,
                    backgroundColor: COLORS.transparentBlack4,
                    paddingTop: 10
                }}
            >
                <Animatable.View
                    animation='fadeInUpBig'
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.white,
                        borderTopRightRadius: SIZES.radius,
                        borderTopLeftRadius: SIZES.radius
                    }}
                >
                    <View
                        style={{
                            flex: .1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: SIZES.radius,
                            borderBottomColor: COLORS.gray20,
                            borderBottomWidth: 1
                        }}
                    >
                        <Text
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                ...FONTS.h2
                            }}
                        >Choose Pick Up</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(!modalVisible)
                                setFavouritePlaces((previous) => {
                                    return previous.map((p, i) => {
                                        return { ...p, selected: false }
                                    })
                                })
                            }}
                        >
                            <Image
                                source={icons.close}
                                resizeMode='cover'
                                style={{
                                    width: 20,
                                    height: 20
                                }}

                            />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flex: .9,
                            paddingVertical: SIZES.padding
                        }}
                    >
                        <View style={{ paddingHorizontal: SIZES.radius }}>
                            <View
                                style={[{
                                    flexDirection: 'row',
                                    paddingHorizontal: SIZES.base,
                                    paddingVertical: 5,
                                    borderRadius: SIZES.radius,
                                    backgroundColor: COLORS.gray10,
                                }, styles.shadow]}
                            >
                                <View
                                    style={{
                                        width: 50,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <View
                                        style={{
                                            padding: SIZES.base,
                                            borderRadius: SIZES.radius,
                                            backgroundColor: COLORS.lightyellow
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 15,
                                                height: 15,
                                                backgroundColor: COLORS.sceondary,
                                                borderRadius: SIZES.radius
                                            }}
                                        />
                                    </View>
                                </View>
                                <GooglePlacesAutocomplete
                                    ref={originRef}
                                    nearbyPlacesAPI="GooglePlacesSearch"
                                    debounce={400}
                                    placeholder="Where from?"
                                    enablePoweredByContainer={false}
                                    minLength={2}
                                    fetchDetails={true}
                                    onPress={(data, details = null) => {
                                        setOrigin({
                                            location: details?.geometry.location,
                                            description: data.description,
                                        })
                                    }}
                                    query={{
                                        key: GOOGLE_MAPS_API_KEY,
                                        language: "en",
                                    }}
                                    styles={toInputBoxStyles}
                                />
                            </View>
                            <View
                                style={[{
                                    flexDirection: 'row',
                                    paddingHorizontal: SIZES.base,
                                    paddingVertical: 5,
                                    marginTop: SIZES.base,
                                    borderRadius: SIZES.radius,
                                    backgroundColor: COLORS.gray10,
                                }, styles.shadow]}
                            >
                                <View
                                    style={{
                                        width: 50,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <View
                                        style={{
                                            width: SIZES.radius,
                                            height: SIZES.radius,
                                            backgroundColor: COLORS.sceondary,
                                            borderRadius: 8
                                        }}
                                    />
                                </View>
                                <GooglePlacesAutocomplete
                                    ref={destinationRef}
                                    nearbyPlacesAPI="GooglePlacesSearch"
                                    debounce={400}
                                    placeholder="Where to?"
                                    enablePoweredByContainer={false}
                                    minLength={2}
                                    fetchDetails={true}
                                    onPress={(data, details = null) => {
                                        setDestination({
                                            location: details?.geometry.location,
                                            description: data.description,
                                        })
                                    }}
                                    query={{
                                        key: GOOGLE_MAPS_API_KEY,
                                        language: "en",
                                    }}
                                    styles={toInputBoxStyles}
                                />
                            </View>

                            {/* Vertical Line */}
                            {
                                origin && destination &&
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: '50%', left: '12%',
                                        width: 3,
                                        height: 65,
                                        backgroundColor: COLORS.sceondary
                                    }}
                                >
                                </View>
                            }


                            <TouchableOpacity
                                style={{
                                    marginTop: SIZES.padding,
                                    marginBottom: SIZES.radius,
                                    alignSelf: 'flex-end'
                                }}
                                onPress={() => handlePickUp()}
                            >
                                <Image
                                    source={icons.doubleArrow}
                                    resizeMode='cover'
                                    style={{
                                        width: 20,
                                        height: 20
                                    }}

                                />
                            </TouchableOpacity>

                        </View>

                        <LineDivider
                            lineStyle={{
                                height: 5,
                                marginVertical: SIZES.base
                            }}
                        />
                        {
                            favouritePlaces &&
                            <FavouritePlaces
                                showTitle={false}
                                setOrigin={setOrigin}
                                setModalVisible={setModalVisible}
                                favouritePlaces={favouritePlaces}
                                setFavouritePlaces={setFavouritePlaces}
                            />
                        }

                    </View>
                </Animatable.View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default PickUpModal

const toInputBoxStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    textInput: {
        backgroundColor: COLORS.transparent,
        paddingBottom: 0,
        ...FONTS.body4
    }
});

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