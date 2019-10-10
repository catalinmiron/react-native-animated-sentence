import * as React from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';

export default class TextAnimator extends React.Component {
  animatedValues = [];

  constructor(props) {
    super(props);

    const textArr = props.content.trim().split(' ');
    textArr.forEach((_, i) => {
      this.animatedValues[i] = new Animated.Value(0);
    });
    this.textArr = textArr;
  }

  componentDidMount() {
    this.animated();
  }

  animated = (toValue = 1) => {
    const animations = this.textArr.map((_, i) => {
      return Animated.timing(this.animatedValues[i], {
        toValue,
        duration: this.props.duration,
        useNativeDriver: true
      });
    });

    Animated.stagger(
      this.props.duration / 5,
      toValue === 0 ? animations.reverse() : animations
    ).start(() => {
      setTimeout(() => this.animated(toValue === 0 ? 1 : 0), 1000);
      if (this.props.onFinish) {
        this.props.onFinish();
      }
    });
  };

  render() {
    return (
      <View style={[this.props.style, styles.textWrapper]}>
        {this.textArr.map((word, index) => {
          return (
            <Animated.Text
              key={`${word}-${index}`}
              style={[
                this.props.textStyle,
                {
                  opacity: this.animatedValues[index],
                  transform: [
                    {
                      translateY: Animated.multiply(
                        this.animatedValues[index],
                        new Animated.Value(-5)
                      )
                    }
                  ]
                }
              ]}
            >
              {word}
              {`${index < this.textArr.length ? ' ' : ''}`}
            </Animated.Text>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
});
