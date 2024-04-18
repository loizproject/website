export const useGetCookie = (query) => {
  const cookies = decodeCookies();
  for (name in cookies) {
    const value = cookies[name];
    if (name.indexOf(":" + query) == 0) {
      return { name, value };
    }
  }
}

function decodeCookies() {
  const dc = document.cookie;
  const cookieParts = dc.split(";"),
    cookies = {};

  for (var i = 0; i < cookieParts.length; i++) {
    const name_value = cookieParts[i],
      equals_pos = name_value.indexOf("="),
      name = unescape(name_value.slice(0, equals_pos)).trim(),
      value = unescape(name_value.slice(equals_pos + 1));

    cookies[":" + name] = value;
  }
  return cookies;
}