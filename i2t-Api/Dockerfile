# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install build deps, Tesseract, Hunspell, and git
RUN apt-get update && apt-get install -y \
    git \
    autoconf automake libtool pkg-config \
    build-essential \
    tesseract-ocr \
    libtesseract-dev \
    hunspell \
    hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# Build Leptonica 1.82.0 from source
RUN git clone --branch 1.82.0 https://github.com/DanBloomberg/leptonica.git /tmp/leptonica \
    && cd /tmp/leptonica \
    && ./autogen.sh && ./configure && make && make install \
    && ldconfig \
    && rm -rf /tmp/leptonica

# Copy published app
COPY --from=build /app/publish .

# Copy tessdata + dictionaries
COPY i2t-Api/tessdata /app/tessdata
COPY i2t-Api/Dictionaries /app/Dictionaries

# OCR env vars
ENV TESSDATA_PREFIX=/app/tessdata
ENV LD_LIBRARY_PATH=/usr/local/lib:/app:/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
