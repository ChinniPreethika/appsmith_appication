export default {
  run() {
    // Run the query to validate user login credentials
    ValidateUserLogin.run()
      .then(response => {
        console.log("Login Response:", response); // Log the response for debugging

        // Check if response is not empty
        if (response.length > 0) {
          const userName = response[0].name; // Get the name of the user from the response
          const userType = response[0].usertype; // Get the usertype (admin or user)
          
          console.log("User Name:", userName); // Log the user name for debugging
          console.log("User Type:", userType); // Log the user type for debugging

          // Store the logged-in user information in Appsmith store for later use
          storeValue("loggedInUserName", userName);
          storeValue("loggedInUserType", userType);
					 console.log("Stored User Name in Appsmith Store:", appsmith.store.loggedInUserName);
          
					

          // Check the user type and navigate accordingly
          if (userType === "Admin") {
            // Redirect to Admin Dashboard
            navigateTo("checkers", { target: "_self" });
          } else if (userType === "User") {
            // Redirect to User Makers Page
           navigateTo("Makers", { target: "_self" });
          } else {
            // If the user type is not recognized
            showAlert("User type not recognized!", "error");
          }
        } else {
          // Invalid username or password
          showAlert("Invalid username or password!", "error");
        }
      })
      .catch(error => {
        // If an error occurs while logging in
        showAlert("An error occurred while logging in!", "error");
        console.error(error); // Log the error for debugging
      });
  }
};
