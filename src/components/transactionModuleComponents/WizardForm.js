import React, { useState, useRef, useEffect, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Animated, ScrollView } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Colors } from "../../utils";

const CustomButton = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

function Wizard({ title, children }) {
  const steps = useMemo(() => React.Children.toArray(children), [children]);
  const [currentStep, setCurrentStep] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const progressPercentage = ((currentStep + 1) / steps.length) * 100;

    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [currentStep, steps.length]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.groupStack}>
        <View style={styles.group}>
          {steps.map((step, index) => {
            let circleStyle = index < currentStep 
              ? { backgroundColor: "white", borderColor: 'blue' }
              : index === currentStep ?
                { backgroundColor: 'blue', borderColor: 'blue' } 
                : { backgroundColor: 'white', borderColor: 'grey' }
                ;
              
            let iconColor = index < currentStep 
              ? "blue" 
              : index === currentStep 
              ? "white" 
              : "grey";

            return (
              <View key={index} style={styles.circleContainer}>
                <View style={[styles.circle, circleStyle]}>
                  <FontAwesome5
                    size={20}
                    name={"clipboard-list"}
                    color={iconColor}
                  />
                </View>
                <Text style={styles.circleText}>{title[index]}</Text>
              </View>
            );
          })}
        </View>
        <Animated.View style={[styles.rect, { width: progressAnim.interpolate({
          inputRange: [0, 100],
          outputRange: ['0%', '100%'],
        }) }]} />
      </View>
      <View style={styles.stepContainer}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <View style={{ alignItems: "center", overflow: "scroll",}}>
            {steps[currentStep]}
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title={"Previous"}
          onPress={handlePrevious}
          disabled={currentStep === 0}
        />
        <CustomButton
          title={currentStep === steps.length - 1 ? "Finish" : "Next"}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#d3d3d3",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  group: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  circleContainer: {
    alignItems: "center",
  },
  circle: {
    marginTop: 20,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    justifyContent: "center",
    elevation: 2,
    alignItems: "center",
    zIndex: 1,
  },
  circleText: {
    marginTop: 5,
    fontSize: 14,
    color: "grey",
    textAlign: "center",
    fontWeight: "bold"
  },
  rect: {
    position: "absolute",
    top: 42.5,
    left: 0,
    height: 2,
    backgroundColor: "blue",
    zIndex: 0,
  },
  groupStack: {
    width: "100%",
  },
  stepContainer: {
    justifyContent: "center",
    maxHeight: "75%"
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default Wizard;
