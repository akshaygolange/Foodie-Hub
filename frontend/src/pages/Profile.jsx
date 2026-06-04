import React from "react";

const Profile = () => {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">

        <div className="flex flex-col items-center">

          <div className="w-24 h-24 rounded-full bg-orange-500 text-white flex items-center justify-center text-4xl font-bold">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </div>

          <h1 className="mt-4 text-3xl font-bold">
            {userInfo?.name}
          </h1>

          <p className="text-gray-500">
            {userInfo?.email}
          </p>

          <span className="mt-3 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold">
            {userInfo?.role}
          </span>

        </div>

        <div className="mt-8 grid gap-4">

          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-gray-500 text-sm">
              Full Name
            </h3>

            <p className="font-semibold text-lg">
              {userInfo?.name}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-gray-500 text-sm">
              Email
            </h3>

            <p className="font-semibold text-lg">
              {userInfo?.email}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-gray-500 text-sm">
              Role
            </h3>

            <p className="font-semibold text-lg capitalize">
              {userInfo?.role}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;