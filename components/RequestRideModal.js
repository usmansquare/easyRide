import { StyleSheet, Text, View, Modal, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { GOOGLE_MAPS_API_KEY } from '@env'
import Moment from 'moment'
import { useSelector } from 'react-redux'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { FONTS, SIZES, COLORS, icons } from '../constants'
import { LineDivider, RideDriverCard, PaymentMode, CustomAlert } from '../components'
import { auth, db } from '../firebase'
import { MapStyle } from '../styles'

const SURGE_CHARGE_RATE = 1.5;

const RequestRideModal = ({
	modalVisible, setModalVisible, origin, destination, travelInfo, setRideDetails,
	setPaymentModeModal
}) => {
	Moment.locale('en')
	const { appTheme } = useSelector((state) => state.themeReducer)

	const _map = useRef();
	const [fromLocation, setFromLocation] = useState(null);
	const [toLocation, setToLocation] = useState(null);
	const [region, setRegion] = useState(null);
	const [selected, setSelected] = useState(null)
	const [passenger, setPassenger] = useState(null)

	const [uberX, setUberX] = useState(null)
	const [uberXL, setUberXL] = useState(null)
	const [uberLUX, setUberLUX] = useState(null)

	useEffect(() => {
		db.collection("passengers").doc(auth?.currentUser?.uid)
		.get().then((doc) => {
			if (doc.exists) {
				setPassenger(doc.data())
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		}).catch((error) => {
			console.log("Error getting document:", error);
		});
	}, [])

	useEffect(() => {
		if (!origin || !passenger) return;

		setUberX([])
		setUberXL([])
		setUberLUX([])

		db.collection("drivers").where("gender", "==", passenger?.gender).get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				let driver = doc.data()
				let url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + origin.location.lat + '%2C' + origin.location.lng + '&destinations=' + driver.mapInitialRegion.latitude + '%2C' + driver.mapInitialRegion.longitude + '&key=' + GOOGLE_MAPS_API_KEY;

				fetch(url)
					.then((response) => response.json())
					.then((data) => {
						if (driver.rideType === "uberX") {
							setUberX((previous) => {
								return [...previous, {
									...driver,
									distance: data.rows[0].elements[0].distance,
									duration: data.rows[0].elements[0].duration,
								}]
							})
						} else if (driver.rideType === "uberXL") {
							setUberXL((previous) => {
								return [...previous, {
									...driver,
									distance: data.rows[0].elements[0].distance,
									duration: data.rows[0].elements[0].duration,
								}]
							})
						} else {
							setUberLUX((previous) => {
								return [...previous, {
									...driver,
									distance: data.rows[0].elements[0].distance,
									duration: data.rows[0].elements[0].duration,
								}]
							})
						}
					})
					.catch(function (error) {
						console.log(error);
					})
			})
		});
	}, [origin, passenger])

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

		_map.current?.fitToSuppliedMarkers(["origin", "destination"], {
			edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
		});
	}, [origin, destination]);

	const renderUberXRides = () => {
		return (
			<View style={{ marginTop: SIZES.radius }}>
				<View
					style={{
						padding: SIZES.radius
					}}
				>
					<Text style={{
						...FONTS.h3,
						fontSize: 20,
						color: appTheme?.textColor
					}}>Uber X</Text>
					<LineDivider
						lineStyle={{
							width: 45,
							height: 2,
							marginTop: SIZES.base,
							backgroundColor: COLORS.primary
						}}
					/>
				</View>

				{
					uberX === null || uberX.length == 0 ?
						<View style={{ marginTop: SIZES.radius, paddingHorizontal: SIZES.radius }}>
							<Text style={{ ...FONTS.body3, color: appTheme?.textColor }}>No Uber X Ride Available</Text>
						</View>
						: <View>
							{
								uberX.map((item, index) => {
									return (
										<RideDriverCard
											key={`uberX-${index}`}
											icon={icons.taxi_icon}
											label={item.name}
											value={`${item.vehicle.vehicleNo}, ${item.duration.text} away from you`}
											containerStyle={styles.profileContainer}
											selected={selected?.vehicle?.vehicleNo == item.vehicle.vehicleNo ? true : false}
											onPress={() => setSelected(item)}
										/>
									)
								})
							}
						</View>
				}

			</View>
		);
	};

	const renderUberXLRides = () => {
		return (
			<View style={{ marginTop: SIZES.radius }}>
				<View
					style={{
						padding: SIZES.radius
					}}
				>
					<Text style={{
						...FONTS.h3,
						fontSize: 20,
						color: appTheme?.textColor
					}}>Uber XL</Text>
					<LineDivider
						lineStyle={{
							width: 45,
							height: 2,
							marginTop: SIZES.base,
							backgroundColor: COLORS.primary
						}}
					/>
				</View>
				{
					uberXL === null || uberXL.length == 0 ?
						<View style={{ marginTop: SIZES.radius, paddingHorizontal: SIZES.radius }}>
							<Text style={{ ...FONTS.body3, color: appTheme?.textColor }}>No Uber XL Ride Available</Text>
						</View>
						: <View>
							{
								uberXL.map((item, index) => {
									return (
										<RideDriverCard
											key={`uberXL-${index}`}
											icon={icons.taxi_icon}
											label={item?.name}
											value={`${item.vehicle.vehicleNo}, ${item.duration.text} away from you`}
											containerStyle={styles.profileContainer}
											selected={selected?.vehicle?.vehicleNo == item.vehicle.vehicleNo ? true : false}
											onPress={() => setSelected(item)}
										/>
									)
								})
							}
						</View>
				}

			</View>
		);
	};

	const renderUberLUXRides = () => {
		return (
			<View style={{ marginTop: SIZES.radius }}>
				<View
					style={{
						padding: SIZES.radius
					}}
				>
					<Text style={{
						...FONTS.h3,
						fontSize: 20,
						color: appTheme?.textColor
					}}>Uber LUX</Text>
					<LineDivider
						lineStyle={{
							width: 45,
							height: 2,
							marginTop: SIZES.base,
							backgroundColor: COLORS.primary
						}}
					/>
				</View>
				{
					uberLUX === null || uberLUX.length == 0 ?
						<View style={{ marginTop: SIZES.radius, paddingHorizontal: SIZES.radius }}>
							<Text style={{ ...FONTS.body3, color: appTheme?.textColor }}>No Uber LUX Ride Available</Text>
						</View>
						: <View>
							{
								uberLUX.map((item, index) => {
									return (
										<RideDriverCard
											key={`uberLUX-${index}`}
											icon={icons.taxi_icon}
											label={item?.name}
											value={`${item.vehicle.vehicleNo}, ${item.duration.text} away from you`}
											containerStyle={styles.profileContainer}
											selected={selected?.vehicle?.vehicleNo == item.vehicle.vehicleNo ? true : false}
											onPress={() => setSelected(item)}
										/>
									)
								})
							}
						</View>
				}
			</View>
		)
	}

	return (
		<>
			<Modal
				animationType='fade'
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(!modalVisible)}
			>
				<View style={styles.container}>
					<View style={styles.header}>
						{/* <TouchableOpacity
							style={{
								width: 40, height: 40,
								borderRadius: SIZES.padding,
								backgroundColor: COLORS.gray10,
								justifyContent: 'center',
								alignItems: 'center',
								marginBottom: -(SIZES.padding * 2),
								marginLeft: SIZES.base,
								zIndex: 1,
								top: 50
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
						</TouchableOpacity> */}
						<MapView
							ref={_map}
							style={{ flex: 1 }}
							provider={PROVIDER_GOOGLE}
							initialRegion={region}
							customMapStyle={appTheme?.name == "dark" ? MapStyle : null}
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
					<View style={{
						backgroundColor: appTheme?.backgroundColor,
						...styles.footer
					}}
					>
						<View
							style={{
								flex: .2,
								flexDirection: 'row',
								alignItems: 'center',
								paddingHorizontal: SIZES.radius,
								borderBottomColor: appTheme?.LineBorderColor,
								borderBottomWidth: 1
							}}
						>
							<Text style={{
								flex: 1,
								textAlign: 'center',
								color: appTheme?.textColor,
								...FONTS.h3,
							}}
							>Select a Ride - {travelInfo?.distance?.text}</Text>
						</View>
						<View
							style={{ flex: .9 }}
						>
							<ScrollView
								style={{ flex: 1 }}
							>
								{/* Render UberX Rides */}
								{renderUberXRides()}

								{/* Render UberXL Rides */}
								{renderUberXLRides()}

								{/* Render Uber LUX */}
								{renderUberLUXRides()}
							</ScrollView>
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
										<Text style={{ ...FONTS.h3 }}>
											{`${selected?.vehicle?.vehicleNo ?? 'ISB ....'}, ${(selected?.duration?.value || 0 * SURGE_CHARGE_RATE * selected?.multiplier) / 100} PKR`}
										</Text>
									</View>
									<TouchableOpacity
										style={{ width: 130, height: '80%', marginHorizontal: SIZES.radius }}
										onPress={() => {
											setPaymentModeModal(true)
											setRideDetails({
												driverID: selected?.id,
												userID: auth.currentUser.uid,
												duration: selected?.duration,
												distance: selected?.distance,
												origin: origin,
												destination: destination,
												price: (selected?.duration?.value || 0 * SURGE_CHARGE_RATE * selected?.multiplier) / 100,
												bookingDate: Moment(new Date()).format('YYYY-MM-DD'),
												bookingTime: Moment(new Date()).format('hh:mm'),
												status: "upcoming"
											})
										}}
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
		</>
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
		borderTopLeftRadius: SIZES.radius,
		borderTopRightRadius: SIZES.radius,
	},
	profileContainer: {
		height: 75,
		marginTop: SIZES.base,
		marginHorizontal: SIZES.radius,
		paddingHorizontal: SIZES.radius,
		borderRadius: SIZES.radius,
		borderColor: COLORS.gray20
	}
})