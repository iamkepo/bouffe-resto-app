import React from 'react' ;
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native' ;

class ButtonComponent extends React.Component {
    constructor( props ) {
        super( props ) ;
    }

    render() {
        return (
            <TouchableOpacity 
            disabled={this.props.disabled}
            style={[styles.button, { backgroundColor: this.props.Background, height: this.props.Height, justifyContent: this.props.justifyContent ? this.props.justifyContent : "center" }]} 
            onPress={()=> this.props.onPress()}>
                { this.props.Icon ? this.props.Icon : null }
                <Text style={{color: this.props.TextColor, fontSize: this.props.TextSize, fontWeight: this.props.TextBold}}>{this.props.ButtonText}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        borderWidth: 0,
        borderColor: "#fff",
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    }
});

export default ButtonComponent ;