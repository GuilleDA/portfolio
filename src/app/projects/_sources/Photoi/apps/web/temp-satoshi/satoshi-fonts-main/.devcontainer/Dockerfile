ARG VARIANT="35"
FROM fedora:${VARIANT}

RUN useradd -m vscode
RUN echo vscode ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/vscode
USER vscode
RUN sudo dnf group install -y "RPM Development Tools"
RUN sudo dnf install -y unzip git
RUN sudo usermod -aG mock vscode