import {BlockComponent} from "@johannes-lindgren/storyblok-react";
import {ImageAsset} from "@johannes-lindgren/storyblok-js";
import Image from "next/image"
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";

export type ImageStackContent = {
    images: ImageAsset[]
    width: number
    height: number
    x: number
    y: number
    z: number
    distance: number
}

const Root = styled('div', {
    shouldForwardProp: (prop) => prop !== "rotVec" && prop !== "width" && prop !== "height",
})<{ rotVec: Vec, width: number, height: number, imageNorm: Vec }>(({theme, rotVec, width, height}) => {
    // const transform = `rotate3d(0.1,0.5,0, 20deg)`
    // const transform = `rotate3d(${rotVec[0]},${rotVec[1]},${rotVec[2]}, ${phi}deg)`
    const transform = `rotateX(${rotVec[0]}rad) rotateY(${rotVec[1]}rad) rotateZ(${rotVec[2]}rad)`
    const borderWidth = 10;
    return {
        position: 'relative',
        height: `${height}px`,
        '& > *': {
            transition: theme.transitions.create(['top', 'left', 'width', 'height']),
            minWidth: `${width}px`,
            minHeight: `${height}px`,
            position: 'absolute',
            '&:hover span': {
                transform: `${transform} translate(0, -40px)`,
            },
            '&:hover:after': {
                filter: 'opacity(0.5) blur(10px)',
            },
            '& span': {
                transform: transform,
                transition: theme.transitions.create(['transform']),
                border: `${borderWidth}px solid ${theme.palette.grey["A200"]} !important`,
                // borderTop: `${borderWidth}px solid ${theme.palette.grey["A200"]} !important`,
                // borderLeft: `${borderWidth}px solid ${theme.palette.grey["A400"]} !important`,
                borderRadius: theme.shape.borderRadius,
            },
            '&:after': {
                content: `''`,
                transition: theme.transitions.create('filter'),
                transform: transform,
                display: `block`,
                position: `absolute`,
                left: `0px`,
                bottom: `-20px`,
                width: `100%`,
                height: `8px`,
                filter: 'opacity(1) blur(10px)',
                backgroundColor: theme.palette.grey.A700,
            },
        }
    }
})

export const ImageStack: BlockComponent<ImageStackContent> = ({block: {width, height,x,y,z, distance, images}}) => {
    const radians: Vec = [toRad(x ?? 0), toRad(y ?? 0), toRad(z ?? 0)]
    // const dir = normalize(radians)
    // const xAxis: Vec = [1, 0, 0]
    // const yAxis: Vec = [0, 1, 0]
    const zAxis: Vec = [0, 0, 1]
    const imageNorm = rotateZ(rotateY(rotateX(zAxis, radians[0]), radians[1]), radians[2])
    const offset = toHtmlCoordinates(scale(imageNorm, distance ?? 100))
    // TODO memoize computed value
    return (
        <Root rotVec={radians} imageNorm={imageNorm} width={width ?? 200} height={height ?? 500}>
            {images?.map((imageAsset, index) => (
                <PerspectiveImage imageAsset={imageAsset}
                                  left={`${offset[0] * index}px`}
                                  top={offset[1] * index}
                />
            ))}
        </Root>
    )
}

const toHtmlCoordinates = (vec: Vec): Vec => [
    -vec[0],
    vec[1],
    vec[2],
]
type Vec = [number, number, number]
const toRad = (degrees: number): number => degrees / 360 * (2 * 3.14159)
const rotateZ = (v: Vec, phi: number): Vec => [
    v[0] * Math.cos(phi) - v[1] * Math.sin(phi),
    v[0] * Math.sin(phi) + v[1] * Math.cos(phi),
    v[2],
]
const rotateY = (v: Vec, phi: number): Vec => [
    v[0] * Math.cos(phi) + v[2] * Math.sin(phi),
    v[1],
    - v[0] * Math.sin(phi) + v[2] * Math.cos(phi),
]
const rotateX = (v: Vec, phi: number): Vec => [
    v[0],
    v[1] * Math.cos(phi) - v[2] * Math.sin(phi),
    v[1] * Math.sin(phi) + v[2] * Math.cos(phi),
]
// const project = (vector: Vec, on: Vec): Vec => (
//     scale(on, dot(vector, on) / normSquared(on))
// )
const scale = (vec: Vec, coeff: number): Vec => (
    [
        vec[0] * coeff,
        vec[1] * coeff,
        vec[2] * coeff,
    ]
)
// math utils
// const dot =  (a: Vec, b: Vec): number => (
//     a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
// )
// const normSquared = (vec: Vec): number => (
//     vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]
// )
// const normalize = (vec: Vec): Vec => {
//     const len = Math.sqrt(normSquared(vec))
//     return [vec[0] / len, vec[1] / len, vec[2] / len]
// }
// const cross = (a: Vec, b: Vec): Vec => (
//     [
//         a[1] * b[2] - a[2] * b[1],
//         a[2] * b[0] - a[0] * b[2],
//         a[0] * b[1] - a[1] * b[0],
//     ]
// )

const PerspectiveImage = (props: {imageAsset: ImageAsset, top: string | number, left: string | number}) => (
    <Box sx={{
        top: props.top,
        left: props.left,
        borderRadius: 1,
    }}>
        {props.imageAsset.filename && <Image
            // width={200}
            // height={500}
            layout={"fill"}
            src={`${props.imageAsset.filename}/m/200x500/filters:focal(${props.imageAsset.focus})`}
            alt={props.imageAsset.alt ?? undefined}
        />}
    </Box>
)