import { Stack } from "expo-router";
import { CVProvider} from "../context/CVContext";

export default function RootLayout() {
  return (
    <CVProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#3498db"
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          }
        }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Crear CV",
              headerShown: true,
            }}  
          />
          <Stack.Screen
            name="personal-info"
            options={{
              title: "Informacion Personal",
            }}  
          />
          <Stack.Screen
            name="experience"
            options={{
              title: "Expereiencia Personal",
            }}  
          />
          <Stack.Screen
            name="education"
            options={{
              title: "Educación",
            }}  
          />
          <Stack.Screen
            name="skills"
            options={{
              title: "Habilidades",
            }}
          />
          <Stack.Screen
            name="preview"
            options={{
              title: "Vista Previa",
              presentation: "modal"
            }}  
          />
          <Stack.Screen
            name="photo"
            options={{
              title: "Agregar foto",
            }}  
          />
      </Stack>
    </CVProvider>
  )
}
