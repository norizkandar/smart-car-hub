from pathlib import Path

code = r'''import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

/*
  SMART CAR HUB — Expo React Native demo app
  - Car search and filters
  - Favorites
  - Compare up to 4 cars
  - Monthly payment calculator
  - Add a car listing (local demo only)
  - No extra UI libraries required

  IMPORTANT:
  This version stores data in React state, so new listings/favorites reset
  when the app restarts. Real authentication, Supabase database, payments,
  and live listings need backend configuration.
*/

const COLORS = {
  bg: "#07111F",
  panel: "#101E30",
  panel2: "#15263A",
  border: "#263B52",
  text: "#F4F8FC",
  muted: "#9FB0C4",
  green: "#20D6A0",
  blue: "#39B8FF",
  danger: "#FF6B78",
  white: "#FFFFFF",
};

const INITIAL_CARS = [
  { id: "1", make: "Perodua", model: "Myvi 1.5 AV", year: 2023, price: 58900, type: "Hatchback", fuel: "Petrol", transmission: "Automatic", mileage: 18000, location: "Kuala Lumpur", description: "Well maintained, full service record.", emoji: "🚗" },
  { id: "2", make: "Honda", model: "Civic 1.5 TC", year: 2022, price: 118000, type: "Sedan", fuel: "Petrol", transmission: "Automatic", mileage: 26000, location: "Selangor", description: "Comfortable sedan with modern features.", emoji: "🚘" },
  { id: "3", make: "Proton", model: "X50 Premium", year: 2023, price: 89500, type: "SUV", fuel: "Petrol", transmission: "Automatic", mileage: 15000, location: "Penang", description: "Compact SUV, suitable for daily driving.", emoji: "🚙" },
  { id: "4", make: "Toyota", model: "Vios 1.5 G", year: 2021, price: 73500, type: "Sedan", fuel: "Petrol", transmission: "Automatic", mileage: 42000, location: "Perak", description: "Reliable daily car with spacious cabin.", emoji: "🚗" },
  { id: "5", make: "Tesla", model: "Model 3 Standard", year: 2022, price: 155000, type: "Electric", fuel: "Electric", transmission: "Automatic", mileage: 22000, location: "Kuala Lumpur", description: "Electric vehicle with a minimalist interior.", emoji: "⚡" },
  { id: "6", make: "Mazda", model: "CX-5 2.0", year: 2021, price: 108000, type: "SUV", fuel: "Petrol", transmission: "Automatic", mileage: 39000, location: "Johor", description: "Practical SUV with a refined driving feel.", emoji: "🚙" },
  { id: "7", make: "Perodua", model: "Axia 1.0 SE", year: 2024, price: 42000, type: "Hatchback", fuel: "Petrol", transmission: "Automatic", mileage: 8000, location: "Perak", description: "Compact and economical city car.", emoji: "🚗" },
  { id: "8", make: "BMW", model: "320i Sport", year: 2020, price: 138000, type: "Sedan", fuel: "Petrol", transmission: "Automatic", mileage: 51000, location: "Selangor", description: "Sporty premium sedan.", emoji: "🏎️" },
];

const money = (value) => "RM " + Math.max(0, Number(value) || 0).toLocaleString("en-MY", { maximumFractionDigits: 0 });
const TYPES = ["All", "Sedan", "SUV", "Hatchback", "Electric"];

function Button({ title, onPress, variant = "primary", small = false, disabled = false, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        small && styles.buttonSmall,
        variant === "secondary" && styles.buttonSecondary,
        variant === "ghost" && styles.buttonGhost,
        variant === "danger" && styles.buttonDanger,
        disabled && { opacity: 0.45 },
        style,
      ]}
    >
      <Text style={[styles.buttonText, variant !== "primary" && variant !== "danger" && styles.buttonTextSecondary, small && styles.buttonTextSmall]}>{title}</Text>
    </TouchableOpacity>
  );
}

function Pill({ label, selected, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.pill, selected && styles.pillSelected]}>
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <View style={styles.sectionTitleWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.muted}>{subtitle}</Text>}
    </View>
  );
}

function CarCard({ car, favorite, compared, onFavorite, onCompare, onDetails }) {
  return (
    <View style={styles.carCard}>
      <View style={styles.carHero}>
        <Text style={styles.carEmoji}>{car.emoji || "🚗"}</Text>
        <View style={styles.carTags}>
          <Text style={styles.tag}>{car.year}</Text>
          <Text style={styles.tag}>{car.type}</Text>
        </View>
        <TouchableOpacity onPress={onFavorite} style={styles.heart}>
          <Text style={{ fontSize: 22 }}>{favorite ? "♥" : "♡"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.carBody}>
        <Text style={styles.carName}>{car.make} {car.model}</Text>
        <Text style={styles.carMeta}>{car.mileage.toLocaleString("en-MY")} km · {car.transmission} · {car.location}</Text>
        <Text style={styles.carPrice}>{money(car.price)}</Text>
        <Text style={styles.carDescription} numberOfLines={2}>{car.description}</Text>
        <View style={styles.cardActions}>
          <Button title="Details" small onPress={onDetails} style={{ flex: 1 }} />
          <Button title={compared ? "✓ Compare" : "+ Compare"} small variant="secondary" onPress={onCompare} style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [cars, setCars] = useState(INITIAL_CARS);
  const [tab, setTab] = useState("Home");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [loanPrice, setLoanPrice] = useState("80000");
  const [downPayment, setDownPayment] = useState("10000");
  const [interest, setInterest] = useState("3.2");
  const [years, setYears] = useState("7");

  const [newMake, setNewMake] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newYear, setNewYear] = useState("2022");
  const [newPrice, setNewPrice] = useState("");
  const [newType, setNewType] = useState("Sedan");
  const [newLocation, setNewLocation] = useState("");
  const [newMileage, setNewMileage] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const visibleCars = useMemo(() => {
    let list = cars.filter((car) => {
      const text = `${car.make} ${car.model} ${car.year} ${car.location} ${car.type}`.toLowerCase();
      const matchesSearch = text.includes(search.trim().toLowerCase());
      const matchesType = typeFilter === "All" || car.type === typeFilter;
      const cap = Number(maxPrice);
      const matchesPrice = !maxPrice.trim() || (Number.isFinite(cap) && car.price <= cap);
      return matchesSearch && matchesType && matchesPrice;
    });
    if (tab === "Favorites") list = list.filter((car) => favorites.includes(car.id));
    return list;
  }, [cars, search, typeFilter, maxPrice, tab, favorites]);

  const comparedCars = cars.filter((car) => compareIds.includes(car.id));
  const loanAmount = Math.max(0, (Number(loanPrice) || 0) - (Number(downPayment) || 0));
  const months = Math.max(1, (Number(years) || 1) * 12);
  const monthlyRate = Math.max(0, Number(interest) || 0) / 100 / 12;
  const monthlyPayment = monthlyRate === 0
    ? loanAmount / months
    : loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  };

  const toggleCompare = (id) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id);
      if (current.length >= 4) {
        Alert.alert("Compare limit", "You can compare up to 4 cars at a time.");
        return current;
      }
      return [...current, id];
    });
  };

  const addListing = () => {
    if (!newMake.trim() || !newModel.trim() || !newPrice.trim() || !newLocation.trim()) {
      Alert.alert("Missing information", "Please enter make, model, price and location.");
      return;
    }
    const price = Number(newPrice.replace(/,/g, ""));
    if (!Number.isFinite(price) || price <= 0) {
      Alert.alert("Invalid price", "Please enter a valid price in RM.");
      return;
    }
    const item = {
      id: `user-${Date.now()}`,
      make: newMake.trim(),
      model: newModel.trim(),
      year: Number(newYear) || new Date().getFullYear(),
      price,
      type: newType,
      fuel: newType === "Electric" ? "Electric" : "Petrol",
      transmission: "Automatic",
      mileage: Math.max(0, Number(newMileage) || 0),
      location: newLocation.trim(),
      description: newDescription.trim() || "Seller listing added in demo mode.",
      emoji: newType === "Electric" ? "⚡" : newType === "SUV" ? "🚙" : "🚗",
    };
    setCars((current) => [item, ...current]);
    setNewMake(""); setNewModel(""); setNewYear("2022"); setNewPrice("");
    setNewType("Sedan"); setNewLocation(""); setNewMileage(""); setNewDescription("");
    setTab("Home"); setSearch("");
    Alert.alert("Listing added", "Your car is now visible in this app session. This is a local demo, not a live marketplace.");
  };

  const openDetails = (car) => setSelectedCar(car);

  const renderHome = () => (
    <>
      <View style={styles.heroPanel}>
        <Text style={styles.eyebrow}>SMART CAR HUB</Text>
        <Text style={styles.heroTitle}>Find your next{"\n"}drive.</Text>
        <Text style={styles.heroSubtitle}>Explore cars, compare options and estimate your monthly payment.</Text>
        <View style={styles.heroStats}>
          <View><Text style={styles.statNumber}>{cars.length}</Text><Text style={styles.statLabel}>Cars listed</Text></View>
          <View><Text style={styles.statNumber}>{favorites.length}</Text><Text style={styles.statLabel}>Saved</Text></View>
          <View><Text style={styles.statNumber}>{compareIds.length}/4</Text><Text style={styles.statLabel}>Comparing</Text></View>
        </View>
      </View>
      <View style={styles.searchRow}>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search make, model, location..." placeholderTextColor={COLORS.muted} style={styles.searchInput} />
        <Button title={showFilters ? "Hide" : "Filter"} small variant="secondary" onPress={() => setShowFilters(!showFilters)} />
      </View>
      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.fieldLabel}>Car type</Text>
          <View style={styles.pillsRow}>{TYPES.map((type) => <Pill key={type} label={type} selected={typeFilter === type} onPress={() => setTypeFilter(type)} />)}</View>
          <Text style={styles.fieldLabel}>Maximum price (RM)</Text>
          <TextInput value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" placeholder="e.g. 100000" placeholderTextColor={COLORS.muted} style={styles.input} />
          <Button title="Reset filters" variant="ghost" small onPress={() => { setTypeFilter("All"); setMaxPrice(""); setSearch(""); }} />
        </View>
      )}
      <SectionTitle title="Discover cars" subtitle={`${visibleCars.length} result${visibleCars.length === 1 ? "" : "s"} found`} />
      {visibleCars.length ? visibleCars.map((car) => (
        <CarCard key={car.id} car={car} favorite={favorites.includes(car.id)} compared={compareIds.includes(car.id)}
          onFavorite={() => toggleFavorite(car.id)} onCompare={() => toggleCompare(car.id)} onDetails={() => openDetails(car)} />
      )) : <View style={styles.empty}><Text style={styles.emptyTitle}>No cars found</Text><Text style={styles.muted}>Try another keyword or reset your filters.</Text></View>}
    </>
  );

  const renderFavorites = () => (
    <>
      <SectionTitle title="Your favorites" subtitle="Cars you've saved for later." />
      {visibleCars.length ? visibleCars.map((car) => (
        <CarCard key={car.id} car={car} favorite={true} compared={compareIds.includes(car.id)}
          onFavorite={() => toggleFavorite(car.id)} onCompare={() => toggleCompare(car.id)} onDetails={() => openDetails(car)} />
      )) : <View style={styles.empty}><Text style={styles.emptyTitle}>Nothing saved yet</Text><Text style={styles.muted}>Tap the heart on a car to add it here.</Text><Button title="Browse cars" onPress={() => setTab("Home")} style={{ marginTop: 12 }} /></View>}
    </>
  );

  const renderCompare = () => (
    <>
      <SectionTitle title="Compare cars" subtitle="Select up to four cars from Discover." />
      <Text style={styles.muted}>Selected: {comparedCars.length} of 4</Text>
      {comparedCars.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyTitle}>No cars selected</Text><Text style={styles.muted}>Go to Discover and tap “+ Compare” on cars you want to compare.</Text><Button title="Discover cars" onPress={() => setTab("Home")} style={{ marginTop: 12 }} /></View>
      ) : (
        <View style={styles.compareTable}>
          {[
            ["Car", (c) => `${c.make} ${c.model}`],
            ["Price", (c) => money(c.price)],
            ["Year", (c) => String(c.year)],
            ["Type", (c) => c.type],
            ["Mileage", (c) => `${c.mileage.toLocaleString("en-MY")} km`],
            ["Transmission", (c) => c.transmission],
            ["Location", (c) => c.location],
          ].map(([label, getter]) => (
            <View key={label} style={styles.compareRow}>
              <Text style={styles.compareLabel}>{label}</Text>
              <View style={styles.compareValues}>
                {comparedCars.map((car) => <Text key={car.id} style={styles.compareValue}>{getter(car)}</Text>)}
              </View>
            </View>
          ))}
          <Button title="Clear comparison" variant="secondary" onPress={() => setCompareIds([])} style={{ marginTop: 14 }} />
        </View>
      )}
    </>
  );

  const renderCalculator = () => (
    <>
      <SectionTitle title="Loan calculator" subtitle="Estimate your monthly instalment. Actual bank offers may differ." />
      <View style={styles.formPanel}>
        <Text style={styles.fieldLabel}>Car price (RM)</Text>
        <TextInput value={loanPrice} onChangeText={setLoanPrice} keyboardType="numeric" style={styles.input} placeholder="80000" placeholderTextColor={COLORS.muted} />
        <Text style={styles.fieldLabel}>Down payment (RM)</Text>
        <TextInput value={downPayment} onChangeText={setDownPayment} keyboardType="numeric" style={styles.input} placeholder="10000" placeholderTextColor={COLORS.muted} />
        <Text style={styles.fieldLabel}>Annual interest rate (%)</Text>
        <TextInput value={interest} onChangeText={setInterest} keyboardType="decimal-pad" style={styles.input} placeholder="3.2" placeholderTextColor={COLORS.muted} />
        <Text style={styles.fieldLabel}>Loan term (years)</Text>
        <View style={styles.pillsRow}>{["3", "5", "7", "9"].map((y) => <Pill key={y} label={`${y} years`} selected={years === y} onPress={() => setYears(y)} />)}</View>
        <View style={styles.resultPanel}>
          <Text style={styles.resultLabel}>Estimated monthly payment</Text>
          <Text style={styles.resultAmount}>{money(monthlyPayment)}</Text>
          <Text style={styles.muted}>Loan amount: {money(loanAmount)} · {months} months</Text>
        </View>
        <Text style={styles.disclaimer}>Estimate only. It excludes insurance, road tax, fees and other charges.</Text>
      </View>
    </>
  );

  const renderSell = () => (
    <>
      <SectionTitle title="Sell your car" subtitle="Create a demo listing in this app." />
      <View style={styles.formPanel}>
        <Text style={styles.fieldLabel}>Make / brand *</Text>
        <TextInput value={newMake} onChangeText={setNewMake} style={styles.input} placeholder="e.g. Perodua" placeholderTextColor={COLORS.muted} />
        <Text style={styles.fieldLabel}>Model *</Text>
        <TextInput value={newModel} onChangeText={setNewModel} style={styles.input} placeholder="e.g. Myvi 1.5 AV" placeholderTextColor={COLORS.muted} />
        <Text style={styles.fieldLabel}>Year</Text>
        <TextInput value={newYear} onChangeText={setNewYear} keyboardType="numeric" style={styles.input} placeholder="2022" placeholderTextColor={COLORS.muted} />
        <Text style={styles.fieldLabel}>Price (RM) *</Text>
        <TextInput value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" style={styles.input} placeholder="e.g. 55000" placeholderTextColor={COLORS.muted} />
        <Text style={styles.fieldLabel}>Car type</Text>
        <View style={styles.pillsRow}>{TYPES.filter((t) => t !== "All").map((type) => <Pill key={type} label={type} selected={newType === type} onPress={() => setNewType(type)} />)}</View>
        <Text style={styles.fieldLabel}>Location *</Text>
        <TextInput value={newLocation} onChangeText={setNewLocation} style={styles.input} placeholder="e.g. Taiping, Perak" placeholderTextColor={COLORS.muted} />
        <Text style={styles.fieldLabel}>Mileage (km)</Text>
        <TextInput value={newMileage} onChangeText={setNewMileage} keyboardType="numeric" style={styles.input} placeholder="e.g. 25000" placeholderTextColor={COLORS.muted} />
        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput value={newDescription} onChangeText={setNewDescription} multiline style={[styles.input, styles.multiline]} placeholder="Condition, service history, features..." placeholderTextColor={COLORS.muted} />
        <Button title="Publish demo listing" onPress={addListing} style={{ marginTop: 8 }} />
        <Text style={styles.disclaimer}>Demo only: this listing is not uploaded to a server and will disappear when the app restarts.</Text>
      </View>
    </>
  );

  const renderDetails = () => {
    if (!selectedCar) return null;
    const car = selectedCar;
    return (
      <View style={styles.detailsOverlay}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Car details</Text>
          <TouchableOpacity onPress={() => setSelectedCar(null)}><Text style={styles.closeText}>✕</Text></TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.detailHero}><Text style={styles.detailEmoji}>{car.emoji || "🚗"}</Text></View>
          <Text style={styles.carName}>{car.make} {car.model}</Text>
          <Text style={styles.carPrice}>{money(car.price)}</Text>
          <Text style={styles.carDescription}>{car.description}</Text>
          <View style={styles.detailGrid}>
            {[["Year", car.year], ["Type", car.type], ["Mileage", `${car.mileage.toLocaleString("en-MY")} km`], ["Fuel", car.fuel], ["Transmission", car.transmission], ["Location", car.location]].map(([k, v]) => (
              <View key={k} style={styles.detailCell}><Text style={styles.muted}>{k}</Text><Text style={styles.detailValue}>{String(v)}</Text></View>
            ))}
          </View>
          <View style={styles.cardActions}>
            <Button title={favorites.includes(car.id) ? "♥ Saved" : "♡ Save car"} onPress={() => toggleFavorite(car.id)} style={{ flex: 1 }} />
            <Button title={compareIds.includes(car.id) ? "✓ Compared" : "+ Compare"} variant="secondary" onPress={() => toggleCompare(car.id)} style={{ flex: 1 }} />
          </View>
          <Button title="Estimate payment for this car" variant="secondary" onPress={() => { setLoanPrice(String(car.price)); setDownPayment(String(Math.round(car.price * 0.1))); setSelectedCar(null); setTab("Calculator"); }} style={{ marginTop: 10 }} />
          <Text style={styles.disclaimer}>This is sample listing information. Seller contact and booking are not connected.</Text>
        </ScrollView>
      </View>
    );
  };

  const content = tab === "Home" ? renderHome()
    : tab === "Favorites" ? renderFavorites()
    : tab === "Compare" ? renderCompare()
    : tab === "Calculator" ? renderCalculator()
    : renderSell();

  const navItems = [
    { key: "Home", icon: "⌂", label: "Discover" },
    { key: "Favorites", icon: "♡", label: "Saved" },
    { key: "Compare", icon: "⇄", label: "Compare" },
    { key: "Calculator", icon: "▤", label: "Loan" },
    { key: "Sell", icon: "+", label: "Sell" },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.topBar}>
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>SC</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandName}>Smart Car Hub</Text>
          <Text style={styles.brandTagline}>YOUR NEXT DRIVE STARTS HERE</Text>
        </View>
        <View style={styles.demoBadge}><Text style={styles.demoBadgeText}>DEMO</Text></View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {content}
          <View style={styles.footer}>
            <Text style={styles.footerBrand}>SMART CAR HUB</Text>
            <Text style={styles.muted}>Demo marketplace · Drive smarter.</Text>
            <Text style={styles.disclaimer}>Not a real listing service yet. No payments or seller verification are enabled.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity key={item.key} onPress={() => { setSelectedCar(null); setTab(item.key); }} style={[styles.navItem, tab === item.key && styles.navItemActive]}>
            <Text style={[styles.navIcon, tab === item.key && styles.navIconActive]}>{item.icon}</Text>
            <Text style={[styles.navLabel, tab === item.key && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {!!selectedCar && renderDetails()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.bg },
  brandMark: { width: 43, height: 43, borderRadius: 14, backgroundColor: COLORS.green, alignItems: "center", justifyContent: "center", marginRight: 11 },
  brandMarkText: { color: COLORS.bg, fontWeight: "900", fontSize: 15 },
  brandName: { color: COLORS.text, fontSize: 18, fontWeight: "900", letterSpacing: -0.4 },
  brandTagline: { color: COLORS.muted, fontSize: 8, letterSpacing: 1.4, marginTop: 3, fontWeight: "800" },
  demoBadge: { borderColor: COLORS.green, borderWidth: 1, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5 },
  demoBadgeText: { color: COLORS.green, fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  heroPanel: { backgroundColor: COLORS.panel, borderRadius: 23, borderWidth: 1, borderColor: COLORS.border, padding: 22, marginBottom: 19, overflow: "hidden" },
  eyebrow: { color: COLORS.green, fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  heroTitle: { color: COLORS.text, fontSize: 38, fontWeight: "900", lineHeight: 41, letterSpacing: -1.2, marginTop: 10 },
  heroSubtitle: { color: COLORS.muted, fontSize: 13, lineHeight: 20, marginTop: 12, maxWidth: 290 },
  heroStats: { flexDirection: "row", justifyContent: "space-between", marginTop: 23, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  statNumber: { color: COLORS.green, fontSize: 21, fontWeight: "900" },
  statLabel: { color: COLORS.muted, fontSize: 10, marginTop: 3 },
  searchRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  searchInput: { flex: 1, minWidth: 0, backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.border, borderRadius: 13, color: COLORS.text, paddingHorizontal: 13, paddingVertical: 12, fontSize: 13 },
  button: { backgroundColor: COLORS.green, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 15, alignItems: "center", justifyContent: "center" },
  buttonSmall: { paddingVertical: 9, paddingHorizontal: 11, borderRadius: 10 },
  buttonSecondary: { backgroundColor: COLORS.panel2, borderWidth: 1, borderColor: COLORS.border },
  buttonGhost: { backgroundColor: "transparent", borderWidth: 1, borderColor: COLORS.border },
  buttonDanger: { backgroundColor: COLORS.danger },
  buttonText: { color: COLORS.bg, fontWeight: "900", fontSize: 13 },
  buttonTextSecondary: { color: COLORS.text },
  buttonTextSmall: { fontSize: 11 },
  filterPanel: { backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.border, borderRadius: 17, padding: 14, marginBottom: 20 },
  pillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 12 },
  pill: { paddingVertical: 8, paddingHorizontal: 11, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.panel2 },
  pillSelected: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  pillText: { color: COLORS.muted, fontSize: 11, fontWeight: "700" },
  pillTextSelected: { color: COLORS.bg, fontWeight: "900" },
  sectionTitleWrap: { marginTop: 7, marginBottom: 13, gap: 4 },
  sectionTitle: { color: COLORS.text, fontSize: 23, fontWeight: "900", letterSpacing: -0.5 },
  muted: { color: COLORS.muted, fontSize: 12, lineHeight: 18 },
  carCard: { backgroundColor: COLORS.panel, borderRadius: 19, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden", marginBottom: 14 },
  carHero: { height: 125, backgroundColor: "#13283B", alignItems: "center", justifyContent: "center", position: "relative" },
  carEmoji: { fontSize: 64 },
  carTags: { position: "absolute", left: 12, bottom: 10, flexDirection: "row", gap: 6 },
  tag: { color: COLORS.text, fontSize: 10, fontWeight: "800", backgroundColor: "#07111FDD", paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7, overflow: "hidden" },
  heart: { position: "absolute", right: 11, top: 10, width: 37, height: 37, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#07111FCC" },
  carBody: { padding: 14 },
  carName: { color: COLORS.text, fontSize: 17, fontWeight: "900" },
  carMeta: { color: COLORS.muted, fontSize: 11, marginTop: 6 },
  carPrice: { color: COLORS.green, fontSize: 22, fontWeight: "900", marginTop: 10 },
  carDescription: { color: COLORS.muted, fontSize: 12, lineHeight: 18, marginTop: 7 },
  cardActions: { flexDirection: "row", gap: 8, marginTop: 13 },
  empty: { backgroundColor: COLORS.panel, borderRadius: 18, padding: 22, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  emptyTitle: { color: COLORS.text, fontSize: 16, fontWeight: "900", marginBottom: 6 },
  formPanel: { backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.border, borderRadius: 19, padding: 16 },
  fieldLabel: { color: COLORS.text, fontSize: 12, fontWeight: "800", marginBottom: 7, marginTop: 9 },
  input: { backgroundColor: "#0A1727", borderWidth: 1, borderColor: COLORS.border, borderRadius: 11, color: COLORS.text, paddingHorizontal: 12, paddingVertical: 11, fontSize: 13, marginBottom: 7 },
  multiline: { minHeight: 86, textAlignVertical: "top" },
  resultPanel: { backgroundColor: "#0B2B2A", borderColor: "#176B59", borderWidth: 1, borderRadius: 16, padding: 17, marginTop: 14 },
  resultLabel: { color: "#9DEFD6", fontSize: 11, fontWeight: "800" },
  resultAmount: { color: COLORS.green, fontSize: 30, fontWeight: "900", marginVertical: 7 },
  disclaimer: { color: "#8093A9", fontSize: 10, lineHeight: 15, marginTop: 12 },
  compareTable: { backgroundColor: COLORS.panel, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, padding: 12, marginTop: 12 },
  compareRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingVertical: 12 },
  compareLabel: { color: COLORS.muted, fontSize: 11, fontWeight: "800", width: 86 },
  compareValues: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  compareValue: { color: COLORS.text, fontSize: 11, flex: 1, minWidth: 72 },
  footer: { alignItems: "center", paddingVertical: 25 },
  footerBrand: { color: COLORS.text, fontSize: 10, fontWeight: "900", letterSpacing: 2, marginBottom: 5 },
  bottomNav: { flexDirection: "row", backgroundColor: "#0A1625", borderTopWidth: 1, borderTopColor: COLORS.border, paddingHorizontal: 4, paddingTop: 7, paddingBottom: Platform.OS === "ios" ? 17 : 8 },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 5, borderRadius: 12 },
  navItemActive: { backgroundColor: "#14312F" },
  navIcon: { color: COLORS.muted, fontSize: 21, fontWeight: "800" },
  navIconActive: { color: COLORS.green },
  navLabel: { color: COLORS.muted, fontSize: 9, fontWeight: "700", marginTop: 3 },
  navLabelActive: { color: COLORS.green },
  detailsOverlay: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: COLORS.bg, paddingTop: Platform.OS === "ios" ? 50 : 18, paddingHorizontal: 17, paddingBottom: 16 },
  detailsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 14 },
  detailsTitle: { color: COLORS.text, fontSize: 22, fontWeight: "900" },
  closeText: { color: COLORS.text, fontSize: 23, padding: 5 },
  detailHero: { height: 190, borderRadius: 18, backgroundColor: "#13283B", alignItems: "center", justifyContent: "center", marginBottom: 17 },
  detailEmoji: { fontSize: 90 },
  detailGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 18, marginBottom: 18 },
  detailCell: { width: "50%", paddingVertical: 12, paddingHorizontal: 7, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailValue: { color: COLORS.text, fontSize: 13, fontWeight: "800", marginTop: 4 },
});
'''
path = Path("/mnt/data/App.js")
path.write_text(code, encoding="utf-8")
print(f"Created {path} ({len(code.splitlines())} lines, {path.stat().st_size} bytes)")
