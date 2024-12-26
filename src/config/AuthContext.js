import React, { createContext, useState } from "react";


const [LoginStatus , setLoginStatus ] = useState(false);
const login = () => setLoginStatus(true);
const logout = () => setLoginStatus(false);