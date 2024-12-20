import React, { useState } from 'react';
import { User, Phone, Briefcase, Edit2, Save, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from './Avatar';
import type { User as UserType, UserPreferences } from '../../types';
import { useTranslation } from '../../translate/useTranslations';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileInfoProps {
  user: UserType;
  onUpdateProfile: (data: Partial<UserType>) => Promise<UserType>;
}

const defaultPreferences: UserPreferences = {
  smoking: false,
  pets: false,
  nightLife: false
};

export function ProfileInfo({ user, onUpdateProfile }: ProfileInfoProps) {
  const { t } = useTranslation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType>({
    ...user,
    preferences: { ...defaultPreferences, ...user.preferences }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { token, logout } = useAuth();
  const handleAvatarUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE_URL}/api/users/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.status === 401 && token) {
        logout();
        throw new Error('Unauthorized. Please log in again.');
      }
      if (!response.ok) {
        const respText = await response.text();
        console.error('Avatar upload error response:', respText);
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      setEditedUser({ ...editedUser, avatar: data.avatar });
    } catch (err) {
      console.error('Avatar upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await onUpdateProfile(editedUser);
      setEditedUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      ...user,
      preferences: { ...defaultPreferences, ...user.preferences }
    });
    setIsEditing(false);
    setError(null);
  };

  const updatePreference = (key: keyof UserPreferences, value: boolean) => {
    setEditedUser({
      ...editedUser,
      preferences: {
        ...editedUser.preferences,
        [key]: value
      }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-950  rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold">{t("profile_information")}</h2>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="inline-flex items-center">
            <Edit2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{t("edit_profile")}</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleSave}
              disabled={isLoading}
              className='inline-flex items-center'
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleCancel}
              disabled={isLoading}
              className='inline-flex items-center'
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Avatar
            src={editedUser.avatar}
            alt={editedUser.name}
            size="lg"
            onUpload={handleAvatarUpload}
            isEditing={isEditing}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("full_name")}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-md text-gray-600"
              />
            ) : (
              <div className="mt-1 flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <span>{user.name}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("phone")}
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editedUser.phone || ''}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-md text-gray-600"
              />
            ) : (
              <div className="mt-1 flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <span>{user.phone || 'Not provided'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("occupation")}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.occupation}
                onChange={(e) => setEditedUser({ ...editedUser, occupation: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-md text-gray-600"
              />
            ) : (
              <div className="mt-1 flex items-center">
                <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
                <span>{user.occupation}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("bio")}
            </label>
            {isEditing ? (
              <textarea
                value={editedUser.bio || ''}
                onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-md text-gray-600"
                rows={3}
              />
            ) : (
              <p className="mt-1 text-gray-600 dark:text-gray-400">{user.bio || t("no_bio")}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">{t("preferences")}</h3>
          <div className="space-y-2">
            {isEditing ? (
              <>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedUser.preferences.smoking}
                    onChange={(e) => updatePreference('smoking', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-700 text-slate-600 mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t("smoking_allowed")}</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedUser.preferences.pets}
                    onChange={(e) => updatePreference('pets', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-700 text-slate-600 mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t("pet_friendly")}</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedUser.preferences.nightLife}
                    onChange={(e) => updatePreference('nightLife', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-700 text-slate-600 mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t("night_life_friendly")}</span>
                </label>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.values(editedUser.preferences).every((value) => !value) ? (
                   <span className="text-gray-600 dark:text-gray-400">{t("no_preferences")}</span>
                ) : (
                  <>
                    {editedUser.preferences.smoking && (
                      <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded-full text-sm">
                        {t("smoking_allowed")}
                      </span>
                    )}
                    {editedUser.preferences.pets && (
                      <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded-full text-sm">
                        {t("pet_friendly")}
                      </span>
                    )}
                    {editedUser.preferences.nightLife && (
                      <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded-full text-sm">
                        {t("night_life_friendly")}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}