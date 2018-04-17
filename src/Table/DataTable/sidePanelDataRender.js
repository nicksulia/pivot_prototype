export default function (length) {
    const data = [];
    for (let i = 0; i < length; i += 1) {
        data[i] = [`side-${i}`];
    }
    return data;
}