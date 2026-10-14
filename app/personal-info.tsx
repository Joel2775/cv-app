import React, { useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { PersonalInfo } from "../types/cv.types";
import {
  emailValidator,
  maxLength,
  phoneValidator,
  requiredField,
} from "../utils/form-validation";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfo>({
    defaultValues: cvData.personalInfo,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    reset(cvData.personalInfo);
  }, [cvData.personalInfo, reset]);

  const handleSave = (formData: PersonalInfo) => {
    updatePersonalInfo(formData);
    Alert.alert("Éxito", "Información guardada correctamente", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Controller
          control={control}
          name="fullName"
          rules={{
            validate: {
              required: requiredField("su nombre completo"),
              maxLength: maxLength(100),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Nombre Completo *"
              placeholder="Juan Perez"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.fullName?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            validate: {
              required: requiredField("su correo electrónico"),
              email: emailValidator,
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Email *"
              placeholder="juan@gmail.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          rules={{ validate: phoneValidator }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Teléfono"
              placeholder="+593 99 999 9999"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phone?.message}
              keyboardType="phone-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="location"
          rules={{ validate: { maxLength: maxLength(100) } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Ubicación"
              placeholder="Quito, Ecuador"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.location?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="summary"
          rules={{ validate: { maxLength: maxLength(1000) } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Resumen Profesional"
              placeholder="Describe brevemente tu perfil profesional..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.summary?.message}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
            />
          )}
        />

        <NavigationButton
          title="Guardar Información"
          onPress={handleSubmit(handleSave)}
        />
        <NavigationButton
          title="Cancelar"
          onPress={() => router.back()}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
});
