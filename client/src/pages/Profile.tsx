import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

function Profile() {
  const {id: userId} = useSelector((state: RootState) => state.user.user);
  return (
    <div>
      <div>User ID: {userId}</div>
    </div>
  );
}

export default Profile;
