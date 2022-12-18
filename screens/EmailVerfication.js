import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextButton, CustomAlert } from '../components'
import { COLORS, FONTS, icons, SIZES } from '../constants'
import { auth, db } from '../firebase'

const EmailVerfication = () => {

    const [alertModal, setAlertModal] = useState(false)
    const [alert, setAlert] = useState({
      title: '',
      message: ''
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                if (user.emailVerified) {
                    navigation.navigate('tabs')
                }
            } else {
                setVisibility(true)
            }
        })
        return unsubscribe
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.white
            }}
        >
            <Image
                source={icons.email_svg}
                resizeMode="contain"
                style={{
                    width: SIZES.width * .8,
                    height: SIZES.height * .5
                }}
            />
            <View style={{ marginTop: SIZES.radius, paddingHorizontal: SIZES.radius }}>
                <Text style={{ textAlign: 'center', ...FONTS.h2 }}>Verify Your Email</Text>
                <Text style={{ ...FONTS.body3, marginTop: SIZES.base, textAlign: 'center', color: COLORS.gray50 }}>
                    We have sent an email to <Text style={{ fontWeight: 'bold' }}>{auth?.currentUser?.email}</Text> to verify your email address
                    and activate your account. The link in the email will expire in 24 hours
                </Text>
            </View>
            <TextButton
                label='Resend Verification Link'
                containerStyle={{
                    borderRadius: SIZES.radius,
                    marginTop: SIZES.radius,
                    paddingHorizontal: SIZES.radius,
                    backgroundColor: COLORS.purple
                }}
                labelStyle={{
                    color: COLORS.white
                }}
                onPress={() => {
                    const user = auth.currentUser
                    user.sendEmailVerification()

                    setAlertModal(!alertModal)
                    setAlert({
                      title: "Alert",
                      message: "Success, Email Verification Link Send Successfully!"
                    })
                }}
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

export default EmailVerfication

const styles = StyleSheet.create({})