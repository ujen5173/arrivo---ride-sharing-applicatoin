import { View } from "react-native";

import { Button } from "@/components/ui/button";

import { Text } from "@/components/ui/text";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
      <Text className="text-3xl font-bold">Arrivo</Text>
      <Button>
        <Text>Get started</Text>
      </Button>
      <Button variant="outline">
        <Text>Outline</Text>
      </Button>
    </View>
  );
}
