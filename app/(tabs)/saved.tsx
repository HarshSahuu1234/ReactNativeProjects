import React from 'react';
import {View, Text, SafeAreaView, Image} from 'react-native';
import {icons} from "@/constants/icons";

const saved = () => {
  return (
      <SafeAreaView className="bg-primary flex-1 px-10">
          <View className="flex justify-center items-center flex-1 flex-col gap-5">
              <Image source={icons.save} className="size-10" tintColor="#fff" />
              <Text className="text-gray-500 text-base">Save</Text>
          </View>
      </SafeAreaView>
  );
};
export default saved;

