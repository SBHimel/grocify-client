"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Camera,
  Upload,
  Link as LinkIcon,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { uploadToImgBB } from "@/lib/imgUpload";
import { authClient } from "@/lib/auth-client";

interface UserProfile {
  id: string;
  name?: string;
  email: string;
  role: string;
  image?: string;
}

interface ProfileFormProps {
  user: UserProfile;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  // Profile Details State
  const [name, setName] = useState(user.name || "");
  const [imageUrl, setImageUrl] = useState(user.image || "");
  const [inputUrl, setInputUrl] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 1. Photo Upload via ImgBB
  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const toastId = toast.loading("Uploading photo to ImgBB...");

    try {
      const result = await uploadToImgBB(file);
      setImageUrl(result.url);
      toast.success("Photo uploaded! Click 'Save Profile Changes' to persist.", {
        id: toastId,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload photo.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = "";
    }
  };

  // 2. Photo URL input handler
  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    try {
      const parsed = new URL(inputUrl.trim());
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("URL must start with http:// or https://");
      }
      setImageUrl(inputUrl.trim());
      setInputUrl("");
      toast.success("Photo URL applied! Click 'Save Profile Changes' to persist.");
    } catch {
      toast.error("Please enter a valid HTTP or HTTPS image URL.");
    }
  };

  // 3. Save Profile Details (Name & Image)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    setIsUpdatingProfile(true);
    const toastId = toast.loading("Saving profile changes...");

    try {
      // Step 1: Persist name + image to MongoDB via our Express API
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl || "",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Failed to update profile (${res.status})`);
      }

      // Step 2: Also update Better Auth's own session/user record so that
      // authClient.useSession() (used in Header.tsx and DashboardTopNav)
      // reflects the new name and image immediately — no re-login required.
      await authClient.updateUser({
        name: name.trim(),
        image: imageUrl || undefined,
      });

      toast.success("Profile updated successfully!", { id: toastId });
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error saving profile.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // 4. Change Password via Better Auth
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setIsChangingPassword(true);
    const toastId = toast.loading("Updating password...");

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to change password.");
      }

      toast.success("Password changed successfully!", { id: toastId });
      setCurrentPassword("");
      setNewPassword("");
      confirmPassword && setConfirmPassword("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to change password.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Owner Account
          </span>
        );
      case "manager":
      case "seller":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-800">
            <Shield className="w-3.5 h-3.5 text-blue-700" />
            Manager Account
          </span>
        );
      case "worker":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800">
            <UserCheck className="w-3.5 h-3.5 text-amber-700" />
            Staff Worker Account
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            Verified Customer
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* 1. Account Summary Strip */}
      <div
        className="bg-white rounded-3xl border p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        style={{ borderColor: "#e5dbc7" }}
      >
        <div className="flex items-center gap-4">
          <div className="relative group">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name || "User"}
                className="w-20 h-20 rounded-2xl object-cover border-2 shadow-sm"
                style={{ borderColor: "#14532D" }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-sm"
                style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
              >
                {name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-950">{name || "Unnamed User"}</h2>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{user.email}</p>
            <div className="mt-2">{getRoleBadge(user.role)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Profile Details & Photo Management */}
        <div
          className="bg-white rounded-3xl border p-6 sm:p-8 shadow-xs space-y-6"
          style={{ borderColor: "#e5dbc7" }}
        >
          <div className="border-b pb-4" style={{ borderColor: "#f0fdf4" }}>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-[#14532D]" />
              Profile Information
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Update your display name and profile photo.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50/50 focus:border-[#14532D] focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Email (Read-Only) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Email Address <span className="text-gray-400 font-normal">(Account identifier)</span>
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
              />
            </div>

            {/* Photo Management: 2 Input Methods */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <label className="block text-xs font-bold text-gray-800">
                Profile Photo Options
              </label>

              {/* Method A: Device Upload via ImgBB */}
              <div className="p-3.5 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#14532D]" />
                    Upload from Device (ImgBB)
                  </span>
                  {isUploadingPhoto && (
                    <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="profile-photo-upload"
                  disabled={isUploadingPhoto}
                  onChange={handleLocalImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="profile-photo-upload"
                  className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-xl bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-gray-500" />
                  Choose Image File
                </label>
                <p className="text-[10px] text-gray-400 text-center mt-1">
                  JPG, PNG, WEBP up to 10MB.
                </p>
              </div>

              {/* Method B: Paste Image Link */}
              <div className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
                <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#14532D]" />
                  Or Paste Hosted Image URL
                </span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1 px-3 py-1.5 rounded-xl text-xs border border-gray-200 bg-white outline-none focus:border-[#14532D]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Current photo preview & remove */}
              {imageUrl && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-500 text-[11px] truncate max-w-[200px]">
                    Selected: {imageUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="text-red-600 hover:underline text-[11px] font-semibold"
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>

            {/* Save Profile Button */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingProfile || isUploadingPhoto}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
                style={{ background: "#14532D" }}
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Profile Changes"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 3. Change Password Section */}
        <div
          className="bg-white rounded-3xl border p-6 sm:p-8 shadow-xs space-y-6"
          style={{ borderColor: "#e5dbc7" }}
        >
          <div className="border-b pb-4" style={{ borderColor: "#f0fdf4" }}>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#14532D]" />
              Account Security
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Change your password using Better Auth secure credentials.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50/50 focus:border-[#14532D] focus:bg-white outline-none transition-all"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50/50 focus:border-[#14532D] focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50/50 focus:border-[#14532D] focus:bg-white outline-none transition-all"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                Password Requirement
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Password must be at least 8 characters. Changing your password revokes other active sessions for your protection.
              </p>
            </div>

            {/* Change Password Button */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
                style={{ background: "#14532D" }}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
