export default function pin(size: number) {
  let result = "";
  let characters = "0123456789";
  for (let i = 0; i < size; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
