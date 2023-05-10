function getUserInfo() {
    var currentUser = userPool.getCurrentUser();
    console.log('hello from js');
    if (currentUser =! null) {
      currentUser.getSession(function(err, session) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('session validity: ' + session.isValid());
  
        AWS.config.region = 'us-east-1';
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-1:2749b337-ad79-41f0-8ace-2df682206602',
          Logins: {
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_MtQoEp2oE': session.getIdToken().getJwtToken()
          }
        });
  
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  
        var params = {
          AccessToken: session.getAccessToken().getJwtToken()
        };
  
        cognitoidentityserviceprovider.getUser(params, function(err, data) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(data);
          document.getElementById("welcomeMessage").innerHTML = "Hello, " + data.Username;
        });
      });
    } else {
      console.log('No user logged in');
    }
  }
getUserInfo();