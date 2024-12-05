"use client";
import React from "react";
import { Lock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const UnauthorizedPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-6">
          <Lock className="h-7 w-7 text-red-500" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Unauthorized Access</h1>
        <p className="text-gray-500 mb-6">
          You don't have permission to access this page. Please contact your
          administrator for access.
        </p>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
