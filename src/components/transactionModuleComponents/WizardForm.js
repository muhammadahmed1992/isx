import React, { useState, useRef, useEffect, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Animated, ScrollView } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Colors } from "../../utils";
import Alert from '../AlertComponent'; // Import the Alert Component

const CustomButton = ({ title, onPress, disabled, finish }) => {
  return (
    <TouchableOpacity
      style={[styles.button, finish && styles.finishButton, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

function Wizard({ title, children, onFinish, icons }) {
  const steps = useMemo(() => React.Children.toArray(children), [children]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFinishAlert, setShowFinishAlert] = useState(false); // State to handle the finish alert
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

  const handleFinish = () => {
    setShowFinishAlert(true); // Trigger the alert
  };

  return (
    <View style={styles.container}>
      <View style={styles.groupStack}>
        <View style={styles.group}>
          {steps.map((step, index) => {
            let circleStyle = index < currentStep 
              ? { backgroundColor: "white", borderColor: Colors.primary }
              : index === currentStep
              ? { backgroundColor: Colors.primary, borderColor: Colors.primary } 
              : { backgroundColor: 'white', borderColor: 'grey' };

            let iconColor = index < currentStep 
              ? Colors.primary 
              : index === currentStep 
              ? "white" 
              : "grey";

            return (
              <View key={index} style={styles.circleContainer}>
                <View style={[styles.circle, circleStyle]}>
                  <FontAwesome5
                    size={20}
                    name={icons[index]}
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
          <View style={{ alignItems: "center", overflow: "scroll", }}>
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
          finish={currentStep === steps.length - 1}
          onPress={() => {
            if (currentStep === steps.length - 1) {
              handleFinish(); // Call handleFinish on the last step
            } else {
              handleNext();
            }
          }}
        />
      </View>

      {/* Confirmation Alert on Finish */}
      {showFinishAlert && (
        <Alert
          title="Confirmation"
          message="Do you want to proceed?"
          onOkPress={() => {
            onFinish();
            setShowFinishAlert(false);
          }}
          onCancelPress={() => {setShowFinishAlert(false)}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: Colors.grey,
  },
  finishButton: {
    backgroundColor: Colors.red
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    fontWeight: "bold",
    width: 100, // Define a width for the Text component (adjust as needed)
    flexWrap: "wrap", // Ensure the text wraps within the given width
    alignSelf: "center", // Keep it centered within the parent container
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
