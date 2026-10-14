import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatDateValue } from "../utils/date";
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
  const inputValue =
    format === "year" && value ? `${value}-01-01` : value;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.fieldRow}>
        <input
          aria-label={label}
          type="date"
          value={inputValue}
          onChange={(event) => {
            const date = event.currentTarget.value;
            onChangeValue(format === "year" ? date.slice(0, 4) : date);
          }}
          placeholder={placeholder}
          style={
            error
              ? { ...styles.input, ...styles.inputError }
              : styles.input
          }
        />
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
      {format === "year" && value ? (
        <Text style={styles.yearValue}>{formatDateValue(value, format)}</Text>
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
  input: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderRadius: 8,
    borderWidth: 1,
    boxSizing: "border-box",
    color: "#222",
    flex: 1,
    fontFamily: "inherit",
    fontSize: 16,
    minHeight: 48,
    padding: 12,
    width: "100%",
  },
  inputError: {
    borderColor: "#e74c3c",
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
  yearValue: {
    color: "#555",
    fontSize: 13,
    marginTop: 4,
  },
});
