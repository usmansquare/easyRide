import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { COLORS, FONTS, icons, SIZES } from '../constants'
import { useSelector } from 'react-redux'


const RideDriverCard = ({ containerStyle, icon, label, value, onPress, selected=false }) => {
    const { appTheme } = useSelector((state) => state.themeReducer)
    return (
        <TouchableOpacity
            style={{
                height: 80,
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: selected ? COLORS.primary : COLORS.transparent,  
                borderWidth: selected ? 0 : 1,
                ...containerStyle,
            }}
            onPress={onPress}
        >
            {/* Icon */}
            {icon &&
                <View
                    style={{
                        width: 45,
                        height: 45,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        backgroundColor: COLORS.lightyellow
                    }}
                >
                    <Image
                        source={icon}
                        resizeMode='contain'
                        style={{
                            width: 25, height: 25,
                            tintColor: COLORS.sceondary
                        }}
                    />
                </View>
            }
            <View
                style={{
                    flex: 1,
                    marginLeft: icon ? SIZES.radius : 0,
                }}
            >
                {
                    label &&
                    <Text style={{ 
                        ...FONTS.body3, 
                        color: selected ? COLORS.white : appTheme?.textColor 
                    }}>{label}</Text>
                }
                {
                    value ?
                    <Text style={{ 
                        ...FONTS.body4, 
                        color: selected ? COLORS.transparentWhite8 : COLORS.gray40 
                    }}>{value}</Text> : null
                }
            </View>
            <Image
                source={icons.rightArrow}
                resizeMode='contain'
                style={{
                    width: 15,
                    height: 15,
                    tintColor: selected ? COLORS.white :COLORS.gray50
                }}
            />
        </TouchableOpacity>
    )
}

export default RideDriverCard

const styles = StyleSheet.create({})