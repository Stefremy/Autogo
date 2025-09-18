// Allow importing JSON modules
declare module "*.json" {
  const value: any;
  export default value;
}
