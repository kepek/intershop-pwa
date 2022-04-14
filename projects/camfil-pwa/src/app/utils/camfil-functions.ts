export const getValue = <T, K extends keyof T>(data: T, props: { paramName: K }) => data[props.paramName];
