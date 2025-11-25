import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      'address.street': user?.address?.street || '',
      'address.city': user?.address?.city || '',
      'address.state': user?.address?.state || '',
      'address.zipCode': user?.address?.zipCode || '',
      'address.country': user?.address?.country || '',
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const updateData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: {
          street: data['address.street'],
          city: data['address.city'],
          state: data['address.state'],
          zipCode: data['address.zipCode'],
          country: data['address.country'],
        }
      };

      if (data.password) {
        updateData.password = data.password;
      }

      await updateProfile(updateData);
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-20">
              <User size={40} />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold">{user?.name}</h1>
            <p className="text-base-content/60">{user?.email}</p>
            <div className="badge badge-primary mt-2">{user?.role}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email'
                    }
                  })}
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email.message}</span>
                  </label>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="tel"
                className="input input-bordered"
                {...register('phone')}
              />
            </div>

            <div className="divider">Address</div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Street</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                {...register('address.street')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">City</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register('address.city')}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">State</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register('address.state')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Zip Code</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register('address.zipCode')}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Country</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register('address.country')}
                />
              </div>
            </div>

            <div className="divider">Change Password</div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password (optional)</span>
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                className="input input-bordered"
                {...register('password', {
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block mt-6"
            >
              {loading ? <span className="loading loading-spinner"></span> : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
