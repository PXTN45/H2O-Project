import React, { useState } from 'react';

const YourComponent = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
<input
  type="text"
  placeholder="password"
  className="input input-bordered w-full pr-10"
  style={{
    WebkitTextSecurity: showPassword ? 'none' : 'disc',
  } as any}

/>

  );
};

export default YourComponent;
