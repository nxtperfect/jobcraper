{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  packages = with pkgs; [
    stdenv.cc.cc.lib
    zlib
    playwright
    playwright-driver.browsers
    (python312.withPackages (p:
      with p; [
        requests
      ]))
    uv
  ];
  shellHook = ''
    export "LD_LIBRARY_PATH=${pkgs.stdenv.cc.cc.lib}/lib/:/run/opengl-driver/lib/:${pkgs.zlib}"
    export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
    export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
    echo "Welcome to python 3 dev shell"
    python --version
    uv --version
  '';
}
