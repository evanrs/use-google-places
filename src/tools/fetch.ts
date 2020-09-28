export interface TypedResponse<T> extends Response {
  json<P = T>(): Promise<P>;
}

function __fetch<T>(input: RequestInfo, options?: RequestInit): Promise<TypedResponse<T>> {
  return fetch(input, options).then(memoize);
}

function memoize<T>(response: TypedResponse<T>) {
  response.json = () => response.clone().json();
  response.text = () => response.clone().text();

  return response;
}

export { __fetch as fetch };
