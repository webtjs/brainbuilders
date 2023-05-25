export default function Login() {
  return (
    <div>
      <h1>BrainBuilders</h1>
      <h2>Login page</h2>
      <form>
        <label htmlFor="fname">UserName:</label>
        <br />
        <input type="text" id="fname" name="fname" />
        <br />
        <label htmlFor="lname">Password:</label>
        <br />
        <input type="password" id="lname" name="lname" /> <br />
        <input type="button" id="sbutton" name="sbutton" value="Submit" />
        <input type="reset" id="sbutton" name="sbutton" value="Reset" />
      </form>
      <a href="https://www.google.co.nz"> New Account? </a> <br />
      <a href="https://www.google.co.nz"> Remember password? </a>
    </div>
  );
}
