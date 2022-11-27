import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ProfileValue, LineDivider } from '../components'
import { COLORS, SIZES, FONTS, icons } from '../constants'
import { useSelector } from 'react-redux'



const FavouritePlaces = ({ showTitle = true, setDestination, setOrigin, setModalVisible,
    favouritePlaces, setFavouritePlaces
}) => {
    const { appTheme } = useSelector((state) => state.themeReducer)


    return (
        <View>
            {
                showTitle && <View
                    style={{
                        paddingTop: SIZES.padding,
                        padding: SIZES.radius,
                        alignItems: 'center'
                    }}
                >
                    <Text style={{
                        ...FONTS.h3,
                        fontSize: 20,
                        textAlign: 'center',
                        color: appTheme?.textColor
                    }}>recommended where you've been exploring</Text>
                    <LineDivider
                        lineStyle={{
                            width: 60,
                            height: 2,
                            marginVertical: SIZES.base,
                            backgroundColor: COLORS.primary
                        }}
                    />
                </View>
            }
            {
                favouritePlaces.map((item, index) => {
                    if (item.selected === false)
                        return (
                            <ProfileValue
                                key={`place-${index}`}
                                icon={
                                    item.name === "Home" ? icons.home
                                        : item.name === "Work" ? icons.calendar : icons.location
                                }
                                label={item.name}
                                value={item.description}
                                containerStyle={styles.profileContainer}
                                onPress={() => {
                                    if (showTitle) {
                                        setDestination({
                                            location: item.location,
                                            description: item.description
                                        })
                                        setModalVisible(true)
                                        setFavouritePlaces((previous) => {
                                            return previous.map((p, i) => {
                                                if (i === index) {
                                                    return { ...p, selected: true }
                                                } else {
                                                    return p
                                                }
                                            })
                                        })
                                    } else {
                                        setOrigin({
                                            location: item.location,
                                            description: item.description
                                        });
                                        setFavouritePlaces((previous) => {
                                            return previous.map((p, i) => {
                                                if (i === index) {
                                                    return { ...p, selected: true }
                                                } else {
                                                    return p
                                                }
                                            })
                                        })
                                    }
                                }}
                            />
                        )
                })
            }
        </View>
    )
}

export default FavouritePlaces

const styles = StyleSheet.create({
    profileContainer: {
        height: 85,
        marginTop: SIZES.base,
        marginHorizontal: SIZES.radius,
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.gray20
    }
})