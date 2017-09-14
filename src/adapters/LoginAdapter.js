export default class LoginAdapter {
  static login(data) {
    return (
      // fetch("http://localhost:3000/login", {
      fetch("https://immense-scrubland-57490.herokuapp.com/login", {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then((resp) => {return resp.json()})
    )
  }
}
