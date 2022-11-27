import { Text, View, Modal, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import * as Animatable from 'react-native-animatable'
import { COLORS, FONTS, icons, SIZES } from '../constants'


const OrderFoodModal = ({
    modalVisible, setModalVisible
}) => {
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
                    backgroundColor: COLORS.transparentBlack4
                }}
            >
                <Animatable.View
                    animation='fadeInUpBig'
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.white,
                        borderTopRightRadius: SIZES.radius,
                        borderTopLeftRadius: SIZES.radius,

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
                        >Order Food</Text>
                        <TouchableOpacity
                            onPress={() => setModalVisible(!modalVisible)}
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
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Image
                            source={{ uri: "https://links.papareact.com/28w" }}
                            style={{ width: 120, height: 120, resizeMode: "contain" }}
                        />
                        <Text style={{ marginTop: 24, ...FONTS.h2 }}>
                            Not yet implemented...
                        </Text>
                    </View>
                </Animatable.View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default OrderFoodModal

