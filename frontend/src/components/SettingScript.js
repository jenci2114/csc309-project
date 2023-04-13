import React from 'react';
import useScript from "../hooks/useScript";

function SettingScripts() {
  useScript(
    'https://code.jquery.com/jquery-3.2.1.slim.min.js',
    'sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN',
    'anonymous'
  );
  useScript(
    'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js',
    'sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl',
    'anonymous'
  );

  return null;
}

export default SettingScripts;