import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import {
  formatDateValue,
  parseDateValue,
  serializeDateValue,
} from "../utils/date";
import type { DatePickerFieldProps } from "./DatePickerField.types";

export function DatePickerField({
  label,
  value,
  onChangeValue,
  format,
  placeholder,
  clearable = false,
  error,
}: DatePickerFieldProps) {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  const openPicker = () => {
    setPickerDate(parseDateValue(value, format) ?? new Date());
    setPickerVisible(true);
  };

  const handleDateChange = (
    _event: DateTimePickerChangeEvent,
    date: Date
  ) => {
    if (date) {
      setPickerDate(date);
      if (Platform.OS === "android") {
        onChangeValue(serializeDateValue(date, format));
      }
    }
    if (Platform.OS === "android") {
      setPickerVisible(false);
    }
  };

  const savePickerDate = () => {
    onChangeValue(serializeDateValue(pickerDate, format));
    setPickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.fieldRow}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={label}
          style={[styles.field, error && styles.fieldError]}
          onPress={openPicker}
        >
          <Text style={value ? styles.value : styles.placeholder}>
            {formatDateValue(value, format) || placeholder}
          </Text>
          <Text style={styles.calendarIcon}>▦</Text>
        </TouchableOpacity>
        {clearable && value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Quitar ${label.toLowerCase()}`}
            onPress={() => onChangeValue("")}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Quitar</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {Platform.OS === "android" && isPickerVisible ? (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display="default"
          onValueChange={handleDateChange}
          onDismiss={() => setPickerVisible(false)}
        />
      ) : null}

      {Platform.OS === "ios" ? (
        <Modal
          animationType="slide"
          transparent
          visible={isPickerVisible}
          onRequestClose={() => setPickerVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <Pressable
              accessibilityLabel="Cerrar selector de fecha"
              style={StyleSheet.absoluteFill}
              onPress={() => setPickerVisible(false)}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Pressable onPress={() => setPickerVisible(false)}>
                  <Text style={styles.modalAction}>Cancelar</Text>
                </Pressable>
                <Pressable onPress={savePickerDate}>
                  <Text style={styles.modalAction}>Listo</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="spinner"
                onValueChange={handleDateChange}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  fieldRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  field: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: 12,
  },
  fieldError: {
    borderColor: "#e74c3c",
  },
  value: {
    color: "#222",
    fontSize: 16,
  },
  placeholder: {
    color: "#999",
    fontSize: 16,
  },
  calendarIcon: {
    color: "#3498db",
    fontSize: 20,
  },
  clearButton: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  clearButtonText: {
    color: "#e74c3c",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 4,
  },
  modalBackdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  modalHeader: {
    alignItems: "center",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  modalAction: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "600",
  },
});
