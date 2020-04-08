import { createElement } from "react";
import { Text } from "react-native";
import { render } from "react-native-testing-library";
import { dynamicValue } from "@native-mobile-resources/util-widgets";

import { LinearGradient } from "../LinearGradient";
import { BackgroundImageProps } from "../../typings/LinearGradientProps";
import { BackgroundImageStyle } from "../ui/Styles";
import { NativeImage } from "mendix";
import Big from "big.js";

jest.mock("mendix/components/native/Image", () => require.requireActual("./__mocks__/mendix/components/native/Image"));

const defaultProps: BackgroundImageProps<BackgroundImageStyle> = {
    name: "backgroundImageTest",
    style: [],
    image: dynamicValue<NativeImage>({ uri: "path/to/image" }),
    resizeMode: "cover",
    opacity: new Big(0.3333),
    content: <Text>Content</Text>
};

describe("BackgroundImage", () => {
    it("renders with default styles", () => {
        const component = render(<LinearGradient {...defaultProps} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it("renders with custom styles", () => {
        const style: BackgroundImageStyle[] = [
            {
                container: { height: "50%" },
                image: { width: "100%", height: "100%" }
            },
            {
                container: { height: "80%" },
                image: {}
            }
        ];

        const component = render(<LinearGradient {...defaultProps} style={style} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it("renders nothing when image is loading for the first time", () => {
        const image = dynamicValue<NativeImage>(undefined, true);

        const component = render(<LinearGradient {...defaultProps} image={image} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it("renders previous image when image is reloading", () => {
        const image = dynamicValue<NativeImage>({ uri: "path/to/image" }, true);

        const component = render(<LinearGradient {...defaultProps} image={image} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it("renders content only when image is unavailable", () => {
        const image = dynamicValue<NativeImage>({ uri: "path/to/image" });

        const component = render(<LinearGradient {...defaultProps} image={image} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it("renders without content", () => {
        const content = null;

        const component = render(<LinearGradient {...defaultProps} content={content} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it("use correct opacity when image opacity is out of range", () => {
        const negativeImageOpacity = new Big(-0.333);
        const positiveImageOpacity = new Big(1.333);

        const component1 = render(<LinearGradient {...defaultProps} opacity={negativeImageOpacity} />);
        expect(component1.toJSON()).toMatchSnapshot();
        const component2 = render(<LinearGradient {...defaultProps} opacity={positiveImageOpacity} />);
        expect(component2.toJSON()).toMatchSnapshot();
    });
});
