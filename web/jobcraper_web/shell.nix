{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  packages = with pkgs; [
    deno
    eslint
    eslint_d
    prettier
    prettierd
    typescript-go
  ];
  shellHook = ''
    echo "Welcome to JavaScript dev shell"
    deno --version
  '';
}
