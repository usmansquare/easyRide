import { Modal, StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES, icons, FONTS } from '../constants';

const PaymentMode = ({ containerStyle, selectedMode, setSelectedMode, modalVisible,
    setModalVisible, handleRideBooking
}) => {

    const [paymentModes, setPaymentModes] = useState([
        {
            id: 1,
            text: "By Card",
        },
        {
            id: 2,
            text: "By Cash",
        },
        {
            id: 3,
            text: "By Wallet",
        }
    ]);

    return (
        <Modal
            transparent={true}
            animationType='fade'
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: COLORS.transparentBlack4,
                    ...containerStyle
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <View
                        style={{
                            width: 325,
                            height: 225,
                            borderRadius: SIZES.radius,
                            paddingHorizontal: SIZES.padding * .9,
                            backgroundColor: COLORS.white
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                marginTop: 20,
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <Text 
                                style={{ 
                                    ...FONTS.h2, 
                                    fontSize: 18, 
                                    lineHeight: 22, 
                                    marginBottom: SIZES.base 
                                }}>Please select the mode of payment:</Text>
                            {
                                paymentModes.map((item, index) => {
                                    return (
                                        <TouchableWithoutFeedback
                                            key={`payment-mode-${index}`}
                                            style={{
                                                flex: 1,
                                                marginTop: SIZES.base
                                            }}
                                            onPress={() => {
                                                setSelectedMode(item)
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Image
                                                    source={item.id == selectedMode.id ? icons.checkbox_on : icons.checkbox_off}
                                                    resizeMode="cover"
                                                    style={{
                                                        width: 20,
                                                        height: 20
                                                    }}
                                                />
                                                <Text style={{ ...FONTS.h3, marginLeft: SIZES.base }}>{item.text}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    );
                                })
                            }
                        </View>
                        <View
                            style={{
                                height: 60,
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                width: '100%',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                style={{
                                    height: 40,
                                    marginRight: SIZES.base,
                                    paddingHorizontal: SIZES.radius,
                                    borderRadius: SIZES.base,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: COLORS.primary
                                }}
                                onPress={setModalVisible}
                            >
                                <Text style={{ ...FONTS.h3, color: COLORS.gray70 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    height: 40,
                                    paddingHorizontal: SIZES.radius,
                                    borderRadius: SIZES.base,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: COLORS.primary
                                }}
                                onPress={() => {
                                    setModalVisible(!modalVisible)
                                    handleRideBooking()
                                }}
                            >
                                <Text style={{ ...FONTS.h3, color: COLORS.white }}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default PaymentMode