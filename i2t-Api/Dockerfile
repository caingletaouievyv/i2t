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

# Install dependencies for building Leptonica + Tesseract
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    hunspell \
    hunspell-en-us \
    autoconf automake libtool pkg-config g++ make wget \
    && rm -rf /var/lib/apt/lists/*

# Build and install Leptonica 1.82.0
WORKDIR /tmp
RUN wget http://www.leptonica.org/source/leptonica-1.82.0.tar.gz \
    && tar -xvzf leptonica-1.82.0.tar.gz \
    && cd leptonica-1.82.0 \
    && ./configure --prefix=/usr --libdir=/usr/lib/x86_64-linux-gnu \
    && make -j$(nproc) \
    && make install \
    && ldconfig \
    && cd .. && rm -rf leptonica-1.82.0*

# Ensure expected library names exist for .NET interop
RUN REAL_LIB=$(find /usr/lib/x86_64-linux-gnu -name "liblept*.so*" | head -n 1) \
    && cp -f $REAL_LIB /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so \
    && ln -sf /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so /usr/lib/libleptonica.so \
    && ln -sf /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so /usr/lib/libleptonica-1.82.0.so \
    && ldconfig \
    && ls -l /usr/lib*/*lept* /usr/lib*/*leptonica*


# Reset workdir for app
WORKDIR /app

# Export library path
ENV LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

# Copy app from build stage
COPY --from=build /app/publish .

# Copy tessdata models
COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

# Copy Hunspell dictionaries
COPY i2t-Api/Dictionaries /usr/share/hunspell

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
