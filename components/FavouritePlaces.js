import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ProfileValue, LineDivider } from '../components'
import { COLORS, SIZES, FONTS, icons } from '../constants'
import { useSelector } from 'react-redux'

const FavouritePlaces = ({ showTitle = true }) => {
    const { appTheme } = useSelector((state) => state.themeReducer)
    const [favourites, setFavourites] = useState([
        {
            id: "234",
            icon: icons.home,
            name: "Home",
            location: { lat: 5.4945, lng: -0.4118 },
            description: "Jordan Gospel Centre, Land of Grace",
        },
        {
            id: "567",
            icon: icons.calendar,
            name: "Work",
            location: { lat: 5.5497, lng: -0.3522 },
            description: "Finger Bites Kitchen, Mile 11",
        },
    ]);

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
                favourites.map((item, index) => {
                    return (
                        <ProfileValue
                            key={`place-${index}`}
                            icon={item.icon}
                            label={item.name}
                            value={item.description}
                            containerStyle={styles.profileContainer}
                            onPress={() => console.warn("pressed")}
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