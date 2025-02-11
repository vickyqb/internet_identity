import { useState, useEffect } from 'react';
import { internet_identity_backend } from '../../declarations/internet_identity_backend';
import { AuthClient } from '@dfinity/auth-client';
import { Actor } from '@dfinity/agent';
import { IdentityKitProvider, IdentityKitTheme } from "@nfid/identitykit/react"
import { NFIDW, IdentityKitAuthType, Plug, InternetIdentity, Stoic } from "@nfid/identitykit"
import "@nfid/identitykit/react/styles.css"
import { ConnectWallet } from "@nfid/identitykit/react"


function App() {
  const [greeting, setGreeting] = useState('');
  const [authClient, setAuthClient] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    internet_identity_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }
  const handleLogin = async () => {
    await authClient.login({
      identityProvider: process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/"
        : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943",
      onError: (error) => {
        setAuthenticated(false);
        console.error(error);
      },
      onSuccess: () => {
        setAuthClient(authClient);
        updateIdentity(authClient);
      },
    });
  }

  const updateIdentity = async (client) => {
    const current_identity = client.getIdentity();
    setIdentity(current_identity);
    Actor.agentOf(internet_identity_backend).replaceIdentity(current_identity);
    setAuthenticated(true);
    console.log("login success");
  };

  const handleLogout = async () => {
    await authClient?.logout();
    setAuthenticated(false);
    console.log('Logged out');
    setIdentity(null);
  }
  const initAuth = async () => {
    const client = await AuthClient.create();
    setAuthClient(client);

    if (await client.isAuthenticated()) {
      try {
        await updateIdentity(client);
        console.log("Identity updated:");
      } catch (error) {
        console.error("Identity update failed:", error);
        await client.logout();

      }
      console.log("authenticated");
    }
    else {
      console.log("not authenticated:");
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <form action="#" onSubmit={handleSubmit}>
        <label htmlFor="name" className='form-label'>Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" class="form-control " />
        <button type="submit" className="btn btn-primary">Greet!</button>
      </form>
      <div className='container d-flex align-items-center justify-content-around'>
        <div className='login-button'>
          {authenticated ? <button onClick={handleLogout} className="btn btn-danger">Logout</button> : <button onClick={handleLogin} className="btn btn-primary">Login with ii</button>}
        </div>
        <div className='wallet-button'>
          <IdentityKitProvider
            signers={[NFIDW, Plug, InternetIdentity, Stoic]}
            theme={IdentityKitTheme.SYSTEM} // LIGHT, DARK, SYSTEM (by default)
            authType={IdentityKitAuthType.DELEGATION} // ACCOUNTS, DELEGATION (by default)
            onConnectFailure={(e) => { console.log(e) }}
            onConnectSuccess={() => { console.log('Connected') }}
            onDisconnect={() => { console.log('Disconnected') }}
          >
            <ConnectWallet />
          </IdentityKitProvider>
        </div>
      </div>
      <section id="greeting">{greeting}</section>
    </main>
  );
}

export default App;
