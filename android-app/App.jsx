import { StatusBar } from 'expo-status-bar';
import { Text, View, Clipboard, ToastAndroid, TouchableHighlight, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Feather"
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from 'react';
import socket from './socket/socket.io';
import io from 'socket.io-client';


const BACKEND = 'http://localhost:1234'

export default function App() {
  const [code, setCode] = useState(null)
  const [files, setFiles] = useState([])
  async function copyCodeToClipBoard(code) {
    ToastAndroid.showWithGravity("code copied", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
    Clipboard.setString(code)
  }

  async function chooseFile() {
    if ((await ImagePicker.requestMediaLibraryPermissionsAsync()).status === "granted") {

    }
    const file = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true
    })
    setFiles(file.assets)
  }
  const removeImage = i => {
    const filtered = files.filter((item, index) => i !== index)
    setFiles(filtered)
  }
  const getMoviesFromApiAsync = async () => {
    try {
      const response = await fetch(
        BACKEND,
      );
      const json = await response.json();
      return json.movies;
    } catch (error) {
      console.error(error);
    }
  };
  getMoviesFromApiAsync();
  useEffect(() => {
    const sock = io(BACKEND);
    sock.on('connected', () => {
      console.log("socket ");
    })
  })

  return (
    <View className="  pt-8 pb-4 px-2 bg-slate-800 flex-1">
      <StatusBar style="light" />
      <Text className="text-slate-200  font-semibold py-4 px-4 text-xl">Android air drop</Text>
      <View className="flex justify-between items-center flex-row w-full px-4">
        <Text className="text-slate-300 text-lg font-medium">My code</Text>
        <Text className="text-slate-300 text-md font-medium bg-black/20 rounded-md border space-x-2 border-slate-900 px-2 py-1">
          <Text onPress={async () => copyCodeToClipBoard("8554-2334-5666")} className="px-4"> 8554-2334-5666 </Text>
          <Icon name='clipboard' className="text-slate-400 ml-4" />
        </Text>
      </View>
      <ScrollView className="mt-3">

        <View className="flex flex-row flex-wrap overflow-y-auto">

          {
            files.map((image, index) =>
              <View key={index} className="w-[45%]  relative h-[250px] p-1 shadow-md rounded-md m-2 bg-slate-700" >
                <TouchableOpacity onPress={() => removeImage(index)} className="absolute -top-2 p-2 rounded-full bg-red-500 z-10 text-red-50 -right-2">
                  <Icon name='x' className="text-red-500" />
                </TouchableOpacity>
                <Image source={{ uri: image.uri }} className="w-full h-full rounded-md" />
              </View>
            )
          }
        </View>
      </ScrollView>
      <TouchableHighlight onPress={() => chooseFile()} className="mt-auto w-full py-2 px-4 text-slate-400 border border-slate-400 rounded-md">
        <Text className="text-slate-400 text-xl text-center w-full">Drop file</Text>
      </TouchableHighlight>
    </View>
  );
}
