export default class LoginAdapter {
  static login(data) {
    return (
      fetch("http://localhost:3000/login", {
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
