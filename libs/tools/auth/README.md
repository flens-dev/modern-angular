# @flens-dev/tools/auth

## HttpInterceptor with Sign-In Dialog

If an HTTP request errors with a "401 Unauthorized" it can be retried after a successful sign-in.

An `HttpInterceptorFn` can be used to detect such an error.
It can show a dialog to the user to enter the credentials and then retry the request.
The calling component/data-client is not affected, it only takes longer to fullful the request.

### The Flow

- The interceptor catches an error from the backend.
- It asks the `AuthSignInClient.canRetryAfterSignIn` if it can recover from this error after a sign-in.
- If it's an error unrelated to authorization the interceptor rethrows the error to the `DataClient`.
- Otherwise the `AuthSignInClient` is triggered to show the sign-in dialog.
- It will only open the dialog once, but always returns the "afterClosed" trigger (using Angular Material semantics here).
- The interceptor uses this trigger to chain another call with the original HTTP request.
- After the user entered the credentials, the sign-in dialog sends the sign-in request to the backend.  
  **Beware:** This is also an HTTP request, so it will enter the interceptor, too!
  If the sign-in API returns a "401 Unauthorized" you may end up in an infinite loop.
  The `canRetryAfterSignIn` should return "NO" in this case.
- After successfully signing in, the "afterClosed" trigger emits once and completes, which triggers resending the HTTP request.  
  **Note:** If you're using a bearer token for authentication, you have to add that to the original HTTP request.
  You can ask the `AuthSignInClient.modifyRequest` to do it for you.
  If you're using cookie based authentication, you can skip this step.
- If there's still an error when sending this request, it will be thrown to the `DataClient`.
  Signing in is only tried once.
- Otherwise on success the response is returned to the `DataClient` which then passes it through to the component.

```mermaid
sequenceDiagram
  participant C as Component
  participant DC as DataClient
  participant D as SignInDialog
  participant SC as AuthSignInClient
  participant HI as HttpInterceptor
  participant B as ApiBackend

  C->>DC: call getData
  activate C
  activate DC
  DC->>HI: request data
  HI->>B: forward data request
  B->>HI: error response 400/401/403/404/500
  HI->>SC: canRetryAfterSignIn(request, error)
  alt
    SC->>HI: NO
    HI->>DC: throw error
    DC->>C: report error
    deactivate DC
    deactivate C
  else
    activate C
    activate DC
    SC->>HI:YES
    HI->>SC: triggerSignIn
    opt if no "afterClosed" trigger
      SC->>D: open dialog
      activate D
      Note over SC: store "afterClosed" trigger
    end
    SC->>HI: return "afterClosed" trigger
    activate HI
    D->>SC: signIn(username, password)
    SC->>HI: request sign-in
    activate HI
    HI->>B: forward sign-in request
    alt sign-in invalid
      B->>HI: error response 400/403/404/500
      Note over HI, B: if your sign-in API returns 401 as an error<br />you are in trouble here (infinite loop)<br />"canRetryAfterSignIn" must return false in this case
      HI->>SC: forward sign-in response
      SC->>D: return sign-in response
      Note over D: show error<br />try again
    else sign-in valid
      Note over B: create cookie/token
      B->>HI: success response 200 OK
      HI->>SC: forward sign-in response
      deactivate HI
      opt if auth with token
        Note over SC: store token
      end
      SC->>D: return sign-in response
      Note over D: close dialog
    end
    D->>HI: trigger "afterClosed"
    deactivate D
    opt if auth with token
      HI->>SC: modifyRequest(data request)
      Note over SC: e.g. add auth header
      SC->>HI: return modified data request
    end
    HI->>B: forward data request
    alt
      B->>HI: error data response
      Note over HI: if another error occurs, throw it<br />sign-in is only tried once and it was successful<br />we cannot recover with a sign-in
      HI->>DC: throw error
      deactivate HI
      DC->>C: report error
      deactivate DC
      deactivate C
    else
      activate HI
      activate C
      activate DC
      B->>HI: success data response 200 OK
      HI->>DC: forward data response
      deactivate HI
    end
    DC->>C: return data
    deactivate DC
    deactivate C
  end
```

### Usage with Angular Material

- Create your `FooAuthSignInClient` which extends the [`MaterialDialogAuthSignInClient`](./src/material-dialog/material-dialog-auth-sign-in.client.ts).
- Implement the `signIn` method to integrate with your authentication backend.
- Optionally override the `modifyRequest` method, e.g. if you need to add a bearer token.
- Register the [`authSignInInterceptor`](./src/auth-sign-in.interceptor.ts) with the `HttpClient` in your application's configuration.  
  `provideHttpClient(withInterceptors([authSignInInterceptor]))`
- Provide your `FooAuthSignInClient` on the application's configuration.  
  [`provideMaterialDialogAuthSignIn(FooAuthSignInClient)`](./src/material-dialog/provide-material-dialog-auth-sign-in.ts)

### Usage with alternative dialogs

Inspect the [`MaterialDialogAuthSignInClient`](./src/material-dialog/material-dialog-auth-sign-in.client.ts)
and reimplement it with whatever you need.
Also provide a similar function to [`provideMaterialDialogAuthSignIn`](./src/material-dialog/provide-material-dialog-auth-sign-in.ts)
for registering it in the dependency injection container.
