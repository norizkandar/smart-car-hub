
import React, { useMemo, useState } from "react";
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
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  type: string;
  fuel: string;
  transmission: string;
  location: string;
  description: string;
  emoji: string;
};

const COLORS = {
  background: "#07111F",
  surface: "#101E30",
  surfaceLight: "#172A40",
  border: "#263B52",
  text: "#F4F8FC",
  muted: "#9FB0C4",
  green: "#20D6A0",
  cyan: "#39B8FF",
  red: "#FF6577",
};

const CATEGORIES = [
  "All",
  "Sedan",
  "SUV",
  "Hatchback",
  "MPV",
  "Coupe",
  "Electric",
];

const INITIAL_CARS: Car[] = [
  {
    id: "car-001",
    brand: "Perodua",
    model: "Myvi 1.5 AV",
    year: 2023,
    price: 58900,
    mileage: 18000,
    type: "Hatchback",
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Kuala Lumpur",
    description: "Well-maintained compact car with modern safety features.",
    emoji: "🚗",
  },
  {
    id: "car-002",
    brand: "Honda",
    model: "Civic 1.5 TC",
    year: 2022,
    price: 118000,
    mileage: 26000,
    type: "Sedan",
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Selangor",
    description: "Sporty sedan with a comfortable cabin and modern design.",
    emoji: "🚘",
  },
  {
    id: "car-003",
    brand: "Proton",
    model: "X50 Premium",
    year: 2023,
    price: 89500,
    mileage: 15000,
    type: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Penang",
    description: "Compact SUV suitable for daily use and family trips.",
    emoji: "🚙",
  },
  {
    id: "car-004",
    brand: "Toyota",
    model: "Vios 1.5 G",
    year: 2021,
    price: 73500,
    mileage: 42000,
    type: "Sedan",
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Perak",
    description: "Practical sedan with a spacious interior.",
    emoji: "🚘",
  },
  {
    id: "car-005",
    brand: "Tesla",
    model: "Model 3",
    year: 2022,
    price: 155000,
    mileage: 22000,
    type: "Electric",
    fuel: "Electric",
    transmission: "Automatic",
    location: "Kuala Lumpur",
    description: "Electric vehicle with a minimalist interior.",
    emoji: "⚡",
  },
  {
    id: "car-006",
    brand: "Mazda",
    model: "CX-5 2.0",
    year: 2021,
    price: 108000,
    mileage: 39000,
    type: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Johor",
    description: "Comfortable SUV with premium styling.",
    emoji: "🚙",
  },
  {
    id: "car-007",
    brand: "Perodua",
    model: "Axia 1.0 SE",
    year: 2024,
    price: 42000,
    mileage: 8000,
    type: "Hatchback",
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Perak",
    description: "Compact and economical city car.",
    emoji: "🚗",
  },
  {
    id: "car-008",
    brand: "BMW",
    model: "320i Sport",
    year: 2020,
    price: 138000,
    mileage: 51000,
    type: "Sedan",
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Selangor",
    description: "Premium sporty sedan.",
    emoji: "🏎️",
  },
];

const formatMoney = (value: number) =>
  "RM " + Math.round(value || 0).toLocaleString("en-MY");

function Button({
  title,
  onPress,
  secondary = false,
  danger = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        secondary && styles.buttonSecondary,
        danger && styles.buttonDanger,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          (secondary || danger) && { color: COLORS.text },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text
        style={[
          styles.chipText,
          active && { color: COLORS.background },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  numeric = false,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  numeric?: boolean;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor={COLORS.muted}
        keyboardType={numeric ? "numeric" : "default"}
        multiline={multiline}
        style={[
          styles.input,
          multiline && {
            height: 95,
            textAlignVertical: "top",
          },
        ]}
      />
    </View>
  );
}

function CarCard({
  car,
  favorite,
  compared,
  onFavorite,
  onCompare,
  onDetails,
}: {
  car: Car;
  favorite: boolean;
  compared: boolean;
  onFavorite: () => void;
  onCompare: () => void;
  onDetails: () => void;
}) {
  return (
    <View style={styles.carCard}>
      <View style={styles.carImage}>
        <Text style={styles.carEmoji}>{car.emoji}</Text>

        <View style={styles.badges}>
          <Text style={styles.badge}>{car.year}</Text>
          <Text style={styles.badge}>{car.type}</Text>
        </View>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavorite}
        >
          <Text
            style={{
              color: favorite ? COLORS.red : COLORS.text,
              fontSize: 25,
            }}
          >
            {favorite ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.carContent}>
        <Text style={styles.carTitle}>
          {car.brand} {car.model}
        </Text>

        <Text style={styles.muted}>
          {car.mileage.toLocaleString()} km · {car.location}
        </Text>

        <Text style={styles.carPrice}>
          {formatMoney(car.price)}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {car.description}
        </Text>

        <View style={styles.buttonRow}>
          <View style={{ flex: 1 }}>
            <Button title="View details" onPress={onDetails} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title={compared ? "✓ Selected" : "+ Compare"}
              secondary
              onPress={onCompare}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export default function Index() {
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [screen, setScreen] = useState("Discover");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [sortBy, setSortBy] = useState("Recommended");
  const [showFilters, setShowFilters] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const [loanPrice, setLoanPrice] = useState("80000");
  const [deposit, setDeposit] = useState("10000");
  const [interestRate, setInterestRate] = useState("3.2");
  const [loanYears, setLoanYears] = useState("7");

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2022");
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [newCategory, setNewCategory] = useState("Sedan");

  const filteredCars = useMemo(() => {
    let result = cars.filter((car) => {
      const searchText = [
        car.brand,
        car.model,
        car.location,
        car.type,
        String(car.year),
      ]
        .join(" ")
        .toLowerCase();

      const searchMatches = searchText.includes(
        search.trim().toLowerCase()
      );

      const categoryMatches =
        category === "All" || car.type === category;

      const max = Number(maximumPrice);

      const priceMatches =
        !maximumPrice.trim() ||
        (Number.isFinite(max) && car.price <= max);

      const favoriteMatches =
        screen !== "Saved" || favorites.includes(car.id);

      return (
        searchMatches &&
        categoryMatches &&
        priceMatches &&
        favoriteMatches
      );
    });

    if (sortBy === "Price: Low to High") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "Price: High to Low") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "Newest") {
      result = [...result].sort((a, b) => b.year - a.year);
    }

    return result;
  }, [
    cars,
    search,
    category,
    maximumPrice,
    sortBy,
    screen,
    favorites,
  ]);

  const comparedCars = cars.filter((car) =>
    compareIds.includes(car.id)
  );

  const loanAmount = Math.max(
    0,
    (Number(loanPrice) || 0) - (Number(deposit) || 0)
  );

  const months = Math.max(1, (Number(loanYears) || 1) * 12);
  const monthlyRate = Math.max(0, Number(interestRate) || 0) / 1200;

  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -months));

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function toggleCompare(id: string) {
    if (compareIds.includes(id)) {
      setCompareIds((current) =>
        current.filter((item) => item !== id)
      );
      return;
    }

    if (compareIds.length >= 4) {
      Alert.alert(
        "Comparison limit",
        "You can compare up to four cars."
      );
      return;
    }

    setCompareIds((current) => [...current, id]);
  }

  function publishListing() {
    if (
      !brand.trim() ||
      !model.trim() ||
      !price.trim() ||
      !location.trim()
    ) {
      Alert.alert(
        "Missing details",
        "Please enter brand, model, price and location."
      );
      return;
    }

    const numericPrice = Number(price.replace(/,/g, ""));

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      Alert.alert("Invalid price", "Enter a valid car price.");
      return;
    }

    const newCar: Car = {
      id: "car-" + Date.now(),
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year) || 2022,
      price: numericPrice,
      mileage: Number(mileage) || 0,
      type: newCategory,
      fuel: newCategory === "Electric" ? "Electric" : "Petrol",
      transmission: "Automatic",
      location: location.trim(),
      description:
        description.trim() || "New seller demo listing.",
      emoji:
        newCategory === "Electric"
          ? "⚡"
          : newCategory === "SUV"
            ? "🚙"
            : "🚗",
    };

    setCars((current) => [newCar, ...current]);

    setBrand("");
    setModel("");
    setYear("2022");
    setPrice("");
    setMileage("");
    setLocation("");
    setDescription("");
    setNewCategory("Sedan");
    setSearch("");
    setCategory("All");
    setScreen("Discover");

    Alert.alert(
      "Listing created",
      "Your demo listing has been added to the current session."
    );
  }

  function calculateForCar(car: Car) {
    setLoanPrice(String(car.price));
    setDeposit(String(Math.round(car.price * 0.1)));
    setSelectedCar(null);
    setScreen("Loan");
  }

  function renderDiscover() {
    return (
      <>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            SMART CAR HUB · MARKETPLACE
          </Text>

          <Text style={styles.heroTitle}>
            Your next{"\n"}drive starts here.
          </Text>

          <Text style={styles.heroDescription}>
            Discover vehicles, compare your options and plan
            your next purchase.
          </Text>

          <View style={styles.stats}>
            <View>
              <Text style={styles.statNumber}>{cars.length}</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>

            <View>
              <Text style={styles.statNumber}>
                {favorites.length}
              </Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>

            <View>
              <Text style={styles.statNumber}>
                {compareIds.length}/4
              </Text>
              <Text style={styles.statLabel}>Comparing</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search cars, brands, locations..."
            placeholderTextColor={COLORS.muted}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
          />

          <Button
            title="Filter"
            secondary
            onPress={() => setShowFilters(!showFilters)}
          />
        </View>

        {showFilters && (
          <View style={styles.panel}>
            <Text style={styles.label}>CAR CATEGORY</Text>

            <View style={styles.chips}>
              {CATEGORIES.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  active={category === item}
                  onPress={() => setCategory(item)}
                />
              ))}
            </View>

            <InputField
              label="Maximum price (RM)"
              value={maximumPrice}
              onChangeText={setMaximumPrice}
              numeric
              placeholder="e.g. 100000"
            />

            <Text style={styles.label}>SORT RESULTS</Text>

            <View style={styles.chips}>
              {[
                "Recommended",
                "Price: Low to High",
                "Price: High to Low",
                "Newest",
              ].map((item) => (
                <Chip
                  key={item}
                  label={item}
                  active={sortBy === item}
                  onPress={() => setSortBy(item)}
                />
              ))}
            </View>

            <Button
              title="Reset filters"
              secondary
              onPress={() => {
                setSearch("");
                setCategory("All");
                setMaximumPrice("");
                setSortBy("Recommended");
              }}
            />
          </View>
        )}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Explore cars</Text>
            <Text style={styles.muted}>
              {filteredCars.length} vehicles found
            </Text>
          </View>
        </View>

        {filteredCars.length ? (
          filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              favorite={favorites.includes(car.id)}
              compared={compareIds.includes(car.id)}
              onFavorite={() => toggleFavorite(car.id)}
              onCompare={() => toggleCompare(car.id)}
              onDetails={() => setSelectedCar(car)}
            />
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No cars found</Text>
            <Text style={styles.muted}>
              Try a different keyword or reset your filters.
            </Text>
          </View>
        )}
      </>
    );
  }

  function renderSaved() {
    const savedCars = cars.filter((car) =>
      favorites.includes(car.id)
    );

    return (
      <>
        <Text style={styles.sectionTitle}>Saved vehicles</Text>
        <Text style={[styles.muted, { marginBottom: 16 }]}>
          Your favourite cars in one place.
        </Text>

        {savedCars.length ? (
          savedCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              favorite
              compared={compareIds.includes(car.id)}
              onFavorite={() => toggleFavorite(car.id)}
              onCompare={() => toggleCompare(car.id)}
              onDetails={() => setSelectedCar(car)}
            />
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No saved cars yet</Text>
            <Text style={styles.muted}>
              Tap the heart on a car to save it.
            </Text>
            <Button
              title="Discover cars"
              onPress={() => setScreen("Discover")}
            />
          </View>
        )}
      </>
    );
  }

  function renderCompare() {
    const rows: [string, (car: Car) => string][] = [
      ["Price", (car) => formatMoney(car.price)],
      ["Year", (car) => String(car.year)],
      ["Category", (car) => car.type],
      ["Mileage", (car) => `${car.mileage.toLocaleString()} km`],
      ["Fuel", (car) => car.fuel],
      ["Transmission", (car) => car.transmission],
      ["Location", (car) => car.location],
    ];

    return (
      <>
        <Text style={styles.sectionTitle}>Compare vehicles</Text>
        <Text style={[styles.muted, { marginBottom: 15 }]}>
          Compare up to four vehicles side by side.
        </Text>

        {comparedCars.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nothing to compare</Text>
            <Text style={styles.muted}>
              Select cars from Discover to compare their details.
            </Text>
            <Button
              title="Browse cars"
              onPress={() => setScreen("Discover")}
            />
          </View>
        ) : (
          <View style={styles.panel}>
            <View style={styles.compareRow}>
              <Text style={styles.compareLabel}>Vehicle</Text>
              {comparedCars.map((car) => (
                <Text key={car.id} style={styles.compareValue}>
                  {car.brand} {car.model}
                </Text>
              ))}
            </View>

            {rows.map(([label, getValue]) => (
              <View key={label} style={styles.compareRow}>
                <Text style={styles.compareLabel}>{label}</Text>
                {comparedCars.map((car) => (
                  <Text key={car.id} style={styles.compareValue}>
                    {getValue(car)}
                  </Text>
                ))}
              </View>
            ))}

            <Button
              title="Clear comparison"
              secondary
              onPress={() => setCompareIds([])}
            />
          </View>
        )}
      </>
    );
  }

  function renderLoan() {
    return (
      <>
        <Text style={styles.sectionTitle}>Finance calculator</Text>
        <Text style={[styles.muted, { marginBottom: 16 }]}>
          Estimate your car loan instalment.
        </Text>

        <View style={styles.panel}>
          <InputField
            label="Car price (RM)"
            value={loanPrice}
            onChangeText={setLoanPrice}
            numeric
          />

          <InputField
            label="Down payment (RM)"
            value={deposit}
            onChangeText={setDeposit}
            numeric
          />

          <InputField
            label="Annual interest rate (%)"
            value={interestRate}
            onChangeText={setInterestRate}
            numeric
          />

          <Text style={styles.label}>LOAN PERIOD</Text>

          <View style={styles.chips}>
            {["3", "5", "7", "9"].map((item) => (
              <Chip
                key={item}
                label={`${item} years`}
                active={loanYears === item}
                onPress={() => setLoanYears(item)}
              />
            ))}
          </View>

          <View style={styles.loanResult}>
            <Text style={styles.resultLabel}>
              ESTIMATED MONTHLY PAYMENT
            </Text>

            <Text style={styles.resultAmount}>
              {formatMoney(monthlyPayment)}
            </Text>

            <Text style={styles.muted}>
              Principal: {formatMoney(loanAmount)}
            </Text>

            <Text style={styles.muted}>
              Loan period: {months} months
            </Text>
          </View>

          <Text style={styles.note}>
            This is an estimate, not a bank quotation. Actual loan
            terms, fees, insurance and interest calculations may differ.
          </Text>
        </View>
      </>
    );
  }

  function renderSell() {
    return (
      <>
        <Text style={styles.sectionTitle}>Sell your car</Text>
        <Text style={[styles.muted, { marginBottom: 16 }]}>
          Create a sample listing for your vehicle.
        </Text>

        <View style={styles.panel}>
          <InputField
            label="Brand *"
            value={brand}
            onChangeText={setBrand}
            placeholder="e.g. Perodua"
          />

          <InputField
            label="Model *"
            value={model}
            onChangeText={setModel}
            placeholder="e.g. Myvi 1.5 AV"
          />

          <InputField
            label="Year"
            value={year}
            onChangeText={setYear}
            numeric
          />

          <InputField
            label="Price (RM) *"
            value={price}
            onChangeText={setPrice}
            numeric
          />

          <Text style={styles.label}>CATEGORY</Text>

          <View style={styles.chips}>
            {CATEGORIES.filter((item) => item !== "All").map((item) => (
              <Chip
                key={item}
                label={item}
                active={newCategory === item}
                onPress={() => setNewCategory(item)}
              />
            ))}
          </View>

          <InputField
            label="Location *"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Taiping, Perak"
          />

          <InputField
            label="Mileage (km)"
            value={mileage}
            onChangeText={setMileage}
            numeric
          />

          <InputField
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Condition, features, service history..."
          />

          <Button
            title="＋ Publish demo listing"
            onPress={publishListing}
          />

          <Text style={styles.note}>
            Demo only: this listing is held in application memory and
            is not published to a real marketplace.
          </Text>
        </View>
      </>
    );
  }

  const tabs = [
    ["Discover", "⌂"],
    ["Saved", "♡"],
    ["Compare", "⇄"],
    ["Loan", "▤"],
    ["Sell", "+"],
  ];

  const page =
    screen === "Discover"
      ? renderDiscover()
      : screen === "Saved"
        ? renderSaved()
        : screen === "Compare"
          ? renderCompare()
          : screen === "Loan"
            ? renderLoan()
            : renderSell();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>SC</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.brandName}>Smart Car Hub</Text>
          <Text style={styles.brandTagline}>
            FIND IT. COMPARE IT. DRIVE IT.
          </Text>
        </View>

        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>DEMO</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {page}

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>SMART CAR HUB</Text>
            <Text style={styles.muted}>Drive smarter. Choose better.</Text>
            <Text style={styles.note}>
              Demo marketplace. Real accounts, database and payments
              have not been connected in this part.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomNav}>
        {tabs.map(([name, icon]) => (
          <TouchableOpacity
            key={name}
            onPress={() => {
              setSelectedCar(null);
              setScreen(name);
            }}
            style={[
              styles.navItem,
              screen === name && styles.navItemActive,
            ]}
          >
            <Text
              style={[
                styles.navIcon,
                screen === name && { color: COLORS.green },
              ]}
            >
              {icon}
            </Text>

            <Text
              style={[
                styles.navLabel,
                screen === name && { color: COLORS.green },
              ]}
            >
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={selectedCar !== null}
        animationType="slide"
        onRequestClose={() => setSelectedCar(null)}
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.modalHeader}>
            <Text style={styles.sectionTitle}>Vehicle details</Text>
            <TouchableOpacity onPress={() => setSelectedCar(null)}>
              <Text style={{ color: COLORS.text, fontSize: 25 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {selectedCar && (
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.detailImage}>
                <Text style={{ fontSize: 90 }}>{selectedCar.emoji}</Text>
              </View>

              <Text style={styles.carTitle}>
                {selectedCar.brand} {selectedCar.model}
              </Text>

              <Text style={styles.carPrice}>
                {formatMoney(selectedCar.price)}
              </Text>

              <Text style={styles.description}>
                {selectedCar.description}
              </Text>

              {[
                ["Year", String(selectedCar.year)],
                ["Category", selectedCar.type],
                ["Mileage", `${selectedCar.mileage.toLocaleString()} km`],
                ["Fuel", selectedCar.fuel],
                ["Transmission", selectedCar.transmission],
                ["Location", selectedCar.location],
              ].map(([label, value]) => (
                <View key={label} style={styles.detailRow}>
                  <Text style={styles.muted}>{label}</Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </View>
              ))}

              <View style={styles.buttonRow}>
                <View style={{ flex: 1 }}>
                  <Button
                    title={
                      favorites.includes(selectedCar.id)
                        ? "♥ Saved"
                        : "♡ Save car"
                    }
                    onPress={() => toggleFavorite(selectedCar.id)}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Button
                    title={
                      compareIds.includes(selectedCar.id)
                        ? "✓ Compared"
                        : "+ Compare"
                    }
                    secondary
                    onPress={() => toggleCompare(selectedCar.id)}
                  />
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <Button
                  title="Calculate loan"
                  secondary
                  onPress={() => calculateForCar(selectedCar)}
                />
              </View>

              <Text style={styles.note}>
                Sample vehicle data. Seller contact and reservations
                are not connected yet.
              </Text>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  logoText: {
    color: COLORS.background,
    fontWeight: "900",
    fontSize: 15,
  },
  brandName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
  },
  brandTagline: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 1.1,
    marginTop: 4,
  },
  demoBadge: {
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  demoBadgeText: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "900",
  },
  content: {
    padding: 16,
    paddingBottom: 25,
  },
  hero: {
    backgroundColor: COLORS.surface,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    marginBottom: 18,
  },
  eyebrow: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.6,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 38,
    lineHeight: 43,
    fontWeight: "900",
    marginTop: 12,
  },
  heroDescription: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
    marginTop: 22,
  },
  statNumber: {
    color: COLORS.green,
    fontSize: 22,
    fontWeight: "900",
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
  },
  searchRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#0A1727",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    color: COLORS.text,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
  },
  button: {
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSecondary: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonDanger: {
    backgroundColor: COLORS.red,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 11,
    fontWeight: "900",
  },
  panel: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 15,
    marginBottom: 18,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 8,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  chipText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "800",
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 13,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  muted: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
  },
  carCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginBottom: 14,
  },
  carImage: {
    height: 135,
    backgroundColor: "#13283B",
    alignItems: "center",
    justifyContent: "center",
  },
  carEmoji: {
    fontSize: 65,
  },
  badges: {
    position: "absolute",
    left: 11,
    bottom: 10,
    flexDirection: "row",
    gap: 6,
  },
  badge: {
    color: COLORS.text,
    backgroundColor: "#07111FDD",
    fontSize: 9,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
    overflow: "hidden",
  },
  favoriteButton: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#07111FCC",
    alignItems: "center",
    justifyContent: "center",
  },
  carContent: {
    padding: 14,
  },
  carTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "900",
  },
  carPrice: {
    color: COLORS.green,
    fontSize: 23,
    fontWeight: "900",
    marginTop: 9,
  },
  description: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 7,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 13,
  },
  empty: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 7,
  },
  compareRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  compareLabel: {
    color: COLORS.muted,
    width: 76,
    fontSize: 10,
    fontWeight: "900",
  },
  compareValue: {
    color: COLORS.text,
    fontSize: 10,
    flex: 1,
    minWidth: 65,
  },
  loanResult: {
    backgroundColor: "#0B2B2A",
    borderWidth: 1,
    borderColor: "#176B59",
    borderRadius: 16,
    padding: 17,
    marginTop: 12,
  },
  resultLabel: {
    color: "#9DEFD6",
    fontSize: 10,
    fontWeight: "900",
  },
  resultAmount: {
    color: COLORS.green,
    fontSize: 30,
    fontWeight: "900",
    marginVertical: 8,
  },
  note: {
    color: "#8093A9",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 12,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#0A1625",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 4,
    paddingTop: 7,
    paddingBottom: Platform.OS === "ios" ? 16 : 7,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: "#14312F",
  },
  navIcon: {
    color: COLORS.muted,
    fontSize: 21,
    fontWeight: "800",
  },
  navLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 3,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerTitle: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalContent: {
    padding: 18,
    paddingBottom: 30,
  },
  detailImage: {
    height: 205,
    backgroundColor: "#13283B",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailValue: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "800",
  },
});
