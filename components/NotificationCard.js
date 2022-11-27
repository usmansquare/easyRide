import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { icons, SIZES, COLORS, FONTS } from '../constants'

const NotificationCard = ({ containerStyle, notification, onPress }) => {
    const { appTheme } = useSelector((state) => state.themeReducer)
    const { tour, isOpen, date, time } = notification
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                backgroundColor: isOpen ? COLORS.white : COLORS.gray10,
                ...containerStyle
            }}
            onPress={onPress}
        >
            <View
                style={{
                    width: 70,
                    height: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 40,
                    backgroundColor: COLORS.gray20
                }}
            >
                <Image
                    source={icons.profile}
                    resizeMode='contain'
                    style={{
                        width: 35,
                        height: 35,
                        tintColor: COLORS.white
                    }}
                />

            </View>

            {/* Details  */}
            <View
                style={{ flex: 1 }}
            >
                {/* Info */}
                <View
                    style={{
                        paddingHorizontal: SIZES.radius,

                    }}
                >
                    <Text style={{ ...FONTS.body4, color: appTheme?.textColor }}>
                        <Text style={{ ...FONTS.h4, color: appTheme?.textColor }}>{tour.travelAgencyName + " "}</Text>
                        added a new trip: {tour.title}
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent:'space-between',
                            alignItems:'center'
                        }}
                    >
                        <Text style={{ color: COLORS.gray60, ...FONTS.body5 }}>{date}</Text>
                        <Text style={{ color: COLORS.gray60, ...FONTS.body5 }}>{time}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default NotificationCard

const styles = StyleSheet.create({})